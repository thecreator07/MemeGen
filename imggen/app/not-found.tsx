import React from 'react';
const NotFoundPage = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
            fontFamily: 'Arial, sans-serif',
        }}>
            <h1 style={{
                fontSize: '3em',
                color: '#e44d26',
                marginBottom: '0.5em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}>404 - Not Found</h1>
            <p style={{
                fontSize: '1.5em',
                color: '#333',
                padding: '0.5em 1em',
                backgroundColor: '#fff',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}>Could not find requested resource</p>
        </div>
    );
};

export default NotFoundPage;