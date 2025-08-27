import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';

interface LoginProps {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}

const Login = ({ loggedIn, setLoggedIn }: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        navigate('/dashboard');
        console.log("Login successful!");
    };

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                handleLogin();
                console.log("Login successful!");
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
                console.log("Login failed!");
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log('Form submitted!');
        e.preventDefault();
        console.log('Calling login function...');
        login(username, password);
    };

    // If already logged in, redirect to dashboard
    if (loggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-700 to-blue-950">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            placeholder="Enter your username"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            placeholder="Enter your password"
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? 'Signing in...' : 'Login'}
                    </button>
                </form>
                <p className="text-blue-950 text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;