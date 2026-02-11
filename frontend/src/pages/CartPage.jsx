import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        fetchCart(user.id);
    }, [navigate]);

    const fetchCart = (userId) => {
        api.get(`/cart/${userId}`)
            .then(res => {
                setCartItems(res.data);
                calculateTotal(res.data);
            })
            .catch(err => console.error(err));
    };

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        setTotal(sum);
    };

    const handleRemove = (cartId) => {
        api.delete(`/cart/${cartId}`)
            .then(() => {
                const user = JSON.parse(localStorage.getItem('user'));
                fetchCart(user.id);
            })
            .catch(err => console.error(err));
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{item.product.name}</h3>
                                <p style={{ margin: 0, color: '#94a3b8' }}>Quantity: {item.quantity}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <span style={{ fontWeight: 'bold' }}>${item.product.price * item.quantity}</span>
                                <button onClick={() => handleRemove(item.id)} className="btn" style={{ backgroundColor: '#ef4444' }}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="card" style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Total: ${total}</h2>
                        <button onClick={handleCheckout} className="btn" style={{ padding: '1rem 2rem', fontSize: '1.25rem' }}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
