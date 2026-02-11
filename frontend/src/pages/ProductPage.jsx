import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const addToCart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first to add items to cart.');
            navigate('/login');
            return;
        }

        api.post(`/cart/${user.id}/add`, null, {
            params: { productId: product.id, quantity: 1 }
        })
            .then(() => {
                alert('Product added to cart!');
            })
            .catch(err => {
                console.error('Failed to add to cart', err);
                alert('Failed to add to cart');
            });
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '0.5rem' }} />
                ) : (
                    <div style={{ width: '100%', height: '300px', backgroundColor: '#334155', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No Image
                    </div>
                )}
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h1 style={{ marginTop: 0 }}>{product.name}</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '2rem' }}>{product.description}</p>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#3b82f6' }}>
                    ${product.price}
                </div>
                <button onClick={addToCart} className="btn" style={{ padding: '1rem 2rem', fontSize: '1.25rem' }}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductPage;
