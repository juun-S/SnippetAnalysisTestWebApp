import React, { useEffect, useState } from 'react';
import { getOrders } from '../api';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        getOrders(user.id)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, [navigate]);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card" onClick={() => navigate(`/orders/${order.id}`)} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>Order #{order.id}</h3>
                                <span style={{
                                    color: order.status === 'COMPLETED' ? 'green' :
                                        order.status === 'CANCELLED' ? 'red' : 'orange',
                                    fontWeight: 'bold'
                                }}>
                                    {order.status}
                                </span>
                            </div>
                            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                            <p>Total: ${order.totalPrice}</p>
                            <p>Items: {order.items.length}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
