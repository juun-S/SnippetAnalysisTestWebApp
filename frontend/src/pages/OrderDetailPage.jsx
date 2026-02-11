import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { cancelOrder } from '../api'; // We might need a getOrder specific call or just use generic api.get

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        // Current getOrders returns list, we need generic get or specific get endpoint. 
        // Since we don't have getOrder(id) in OrderController, leveraging existing getOrders(userId) and filtering 
        // might be inefficient but acceptable for prototype, OR add getOrder(id) to backend. 
        // Wait, OrderController only has getOrders(userId). 
        // Let's use that for now to avoid backend context switch, or add a simple get request here if we assume standard REST
        // But OrderController doesn't have GET /orders/{id}. 
        // USE getOrders(userId) and find.

        api.get(`/orders/${user.id}`)
            .then(res => {
                const found = res.data.find(o => o.id == id);
                if (found) setOrder(found);
                else alert('Order not found');
            })
            .catch(err => console.error(err));

    }, [id, navigate]);

    const handleCancel = () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        const user = JSON.parse(localStorage.getItem('user'));
        cancelOrder(order.id, user.id)
            .then(() => {
                alert('Order cancelled successfully');
                // Refresh
                setOrder({ ...order, status: 'CANCELLED' });
            })
            .catch(err => {
                console.error(err);
                alert('Failed to cancel order: ' + (err.response?.data?.message || err.message));
            });
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate('/orders')} className="btn" style={{ marginBottom: '1rem', backgroundColor: '#64748b' }}>Back to History</button>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Order #{order.id}</h1>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: order.status === 'COMPLETED' ? 'green' :
                            order.status === 'CANCELLED' ? 'red' : 'orange'
                    }}>
                        {order.status}
                    </span>
                </div>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                <hr />
                <h3>Items</h3>
                {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>${item.price * item.quantity}</span>
                    </div>
                ))}
                <h2 style={{ textAlign: 'right', marginTop: '1rem' }}>Total: ${order.totalPrice}</h2>

                {order.status === 'COMPLETED' && (
                    <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                        <button onClick={handleCancel} className="btn" style={{ backgroundColor: '#ef4444' }}>
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;
