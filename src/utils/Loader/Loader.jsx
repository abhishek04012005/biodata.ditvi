import React from 'react';
import './Loader.css';

const Loader = () => {
    // if (!isLoading) return null;

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader"></div>
                <p className="loader-text">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;