'use client';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', margin: '2rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Go back to Home</a>
        </div>
    );
}