import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Failed to fetch products", err));
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Featured Products</h1>
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                {products.map(p => (
                    <div key={p.id} className="card">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />}
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{p.name}</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', height: '3rem', overflow: 'hidden' }}>{p.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${p.price}</span>
                            <Link to={`/product/${p.id}`} className="btn">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
