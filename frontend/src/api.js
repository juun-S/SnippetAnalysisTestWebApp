import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPaymentMethods = (userId) => {
    return api.get(`/payment-methods/${userId}`);
};

export const addPaymentMethod = (userId, pluginName, externalKey) => {
    return api.post('/payment-methods', { userId, pluginName, externalKey });
};

export const getOrders = (userId) => {
    return api.get(`/orders/${userId}`);
};

export const cancelOrder = (orderId, userId) => {
    return api.post(`/orders/${orderId}/cancel`, null, { params: { userId } });
};

export default api;
