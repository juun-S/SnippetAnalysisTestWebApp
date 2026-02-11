import React, { useEffect, useState } from 'react';
import api, { getPaymentMethods } from '../api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch Cart
        api.get(`/cart/${user.id}`)
            .then(res => {
                setCartItems(res.data);
                const sum = res.data.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                setTotal(sum);
            })
            .catch(err => console.error(err));

        // Fetch Payment Methods
        getPaymentMethods(user.id)
            .then(res => setPaymentMethods(res.data))
            .catch(err => console.error(err));
    }, [navigate]);

    const handlePlaceOrder = () => {
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        // Pass paymentMethodId as query param
        api.post(`/orders/${user.id}?paymentMethodId=${selectedMethod}`)
            .then(res => {
                alert(`Order placed successfully! Order ID: ${res.data.id}`);
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                alert('Order placement failed: ' + (err.response?.data?.message || err.message));
            });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Checkout</h1>
            <div className="card">
                <h2>Order Summary</h2>
                {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>{item.product.name} x {item.quantity}</p>
                        <p>${item.product.price * item.quantity}</p>
                    </div>
                ))}
                <hr />
                <h3 style={{ textAlign: 'right' }}>Total: ${total}</h3>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Select Payment Method</h2>
                {paymentMethods.length === 0 ? (
                    <div>
                        <p>No payment methods found.</p>
                        <button onClick={() => navigate('/payment-methods')} className="btn">Add Payment Method</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {paymentMethods.map(pm => (
                            <label key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={pm.id}
                                    checked={selectedMethod == pm.id} // loose equality for string/number match
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                />
                                <span>{pm.pluginName} ({pm.externalKey})</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button
                    onClick={handlePlaceOrder}
                    className="btn"
                    style={{ padding: '1rem 2rem', fontSize: '1.25rem' }}
                    disabled={cartItems.length === 0 || !selectedMethod}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
