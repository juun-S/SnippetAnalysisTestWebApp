import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header glass">
            <div className="logo">
                <Link to="/">ShopMall</Link>
            </div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
        </header>
    );
};

export default Header;
