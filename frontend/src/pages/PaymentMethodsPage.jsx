import React, { useEffect, useState } from 'react';
import api, { getPaymentMethods, addPaymentMethod } from '../api';
import { useNavigate } from 'react-router-dom';

const PaymentMethodsPage = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMethod, setNewMethod] = useState({ pluginName: 'CreditCard', externalKey: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPaymentMethods(user.id);
    }, [navigate]);

    const fetchPaymentMethods = (userId) => {
        getPaymentMethods(userId)
            .then(res => setPaymentMethods(res.data))
            .catch(err => console.error(err));
    };

    const handleAddMethod = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        addPaymentMethod(user.id, newMethod.pluginName, newMethod.externalKey)
            .then(res => {
                alert('Payment method added!');
                setPaymentMethods([...paymentMethods, res.data]);
                setShowAddForm(false);
                setNewMethod({ pluginName: 'CreditCard', externalKey: '' });
            })
            .catch(err => {
                console.error(err);
                alert('Failed to add payment method');
            });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Payment Methods</h1>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn" style={{ marginBottom: '1rem' }}>
                {showAddForm ? 'Cancel' : 'Add New Payment Method'}
            </button>

            {showAddForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Add Payment Method</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select
                            value={newMethod.pluginName}
                            onChange={(e) => setNewMethod({ ...newMethod, pluginName: e.target.value })}
                            style={{ padding: '0.5rem' }}
                        >
                            <option value="CreditCard">Credit Card</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Card Number / Email"
                            value={newMethod.externalKey}
                            onChange={(e) => setNewMethod({ ...newMethod, externalKey: e.target.value })}
                            style={{ padding: '0.5rem', flex: 1 }}
                        />
                        <button onClick={handleAddMethod} className="btn">Save</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paymentMethods.length === 0 ? (
                    <p>No payment methods found.</p>
                ) : (
                    paymentMethods.map(pm => (
                        <div key={pm.id} className="card">
                            <h3>{pm.pluginName}</h3>
                            <p>{pm.externalKey}</p>
                            <span style={{ color: pm.active ? 'green' : 'red' }}>{pm.active ? 'Active' : 'Inactive'}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
