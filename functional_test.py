import requests
import json
import time
import sys

BASE_URL = "http://localhost:8080/api"

def print_step(message):
    print(f"\n[STEP] {message}")

def test_flow():
    # 1. Register User
    username = f"testuser_{int(time.time())}"
    password = "password"
    print_step(f"Registering user: {username}")
    
    auth_payload = {
        "username": username,
        "password": password,
        "email": f"{username}@example.com",
        "role": "USER"
    }
    
    user_id = None
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=auth_payload)
        response.raise_for_status()
        user = response.json()
        user_id = user['id']
        print(f"User Registered: ID {user_id}, Username {user['username']}")
    except Exception as e:
        print(f"Failed to register user: {e}")
        return

    print(f"Using User ID: {user_id}")

    # 2. Add Payment Method
    print_step("Adding Payment Method")
    pm_payload = {
        "userId": user_id,
        "pluginName": "CreditCard",
        "externalKey": f"card_{int(time.time())}"
    }
    try:
        response = requests.post(f"{BASE_URL}/payment-methods", json=pm_payload)
        response.raise_for_status()
        pm = response.json()
        pm_id = pm['id']
        print(f"Payment Method Created: ID {pm_id}, Key {pm['externalKey']}")
    except Exception as e:
        print(f"Failed to create payment method: {e}")
        # If this fails, we can't proceed with checkout using this PM, but let's try to proceed if we have a PM ID.
        return

    # 3. Add Item to Cart
    print_step("Creating & Fetching Product")
    product_payload = {
        "name": "Test Product",
        "price": 100.0,
        "description": "A product for testing",
        "stock": 100,
        "category": "Test"
    }
    try:
        # Create product first
        response = requests.post(f"{BASE_URL}/products", json=product_payload)
        response.raise_for_status()
        product = response.json()
        print(f"Created Product: {product['name']} (ID: {product['id']}, Price: {product['price']})")
    except Exception as e:
        print(f"Failed to create/fetch products: {e}")
        return

    print_step("Adding to Cart")
    try:
        # Endpoint: /api/cart/{userId}/add?productId=...&quantity=...
        requests.post(f"{BASE_URL}/cart/{user_id}/add", params={"productId": product['id'], "quantity": 1})
        print("Item added to cart")
    except Exception as e:
        print(f"Failed to add to cart: {e}")
        return

    # 4. Checkout (Create Order)
    print_step("Creating Order (Checkout)")
    order_id = None
    try:
        # Endpoint: /api/orders/{userId}?paymentMethodId=...
        response = requests.post(f"{BASE_URL}/orders/{user_id}", params={"paymentMethodId": pm_id})
        response.raise_for_status()
        order = response.json()
        order_id = order['id']
        print(f"Order Created: ID {order_id}, Total: {order['totalPrice']}, Status: {order['status']}")
    except Exception as e:
        print(f"Failed to create order: {e}")
        return

    # 5. Get Order History
    print_step("Fetching Order History")
    try:
        response = requests.get(f"{BASE_URL}/orders/{user_id}")
        response.raise_for_status()
        orders = response.json()
        found_order = next((o for o in orders if o['id'] == order_id), None)
        if found_order:
            print(f"Order found in history: {found_order['id']} - {found_order['status']}")
        else:
            print("Order not found in history!")
    except Exception as e:
        print(f"Failed to fetch order history: {e}")

    # 6. Cancel Order (Refund)
    print_step("Cancelling Order")
    try:
        response = requests.post(f"{BASE_URL}/orders/{order_id}/cancel", params={"userId": user_id})
        response.raise_for_status()
        print("Order cancellation requested successfully")
    except Exception as e:
        print(f"Failed to cancel order: {e}")

    # 7. Verify Cancellation
    print_step("Verifying Cancellation")
    try:
        response = requests.get(f"{BASE_URL}/orders/{user_id}")
        response.raise_for_status()
        orders = response.json()
        updated_order = next((o for o in orders if o['id'] == order_id), None)
        if updated_order and updated_order['status'] == 'CANCELLED':
            print(f"Order status verified: {updated_order['status']}")
            print("TEST PASSED")
        else:
            print(f"Order status mismatch: {updated_order['status'] if updated_order else 'None'}")
            print("TEST FAILED")
    except Exception as e:
        print(f"Failed to verify cancellation: {e}")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)
