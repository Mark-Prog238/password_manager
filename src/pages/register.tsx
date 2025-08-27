import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const register = async (username: string, password: string) => {
        console.log('Register function called with:', username, password);
        try {
            console.log('Making fetch request...');
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            console.log('Response received:', response);
            const data = await response.json();
            console.log('Response data:', data);
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        console.log('Form submitted!');
        e.preventDefault();
        console.log('Calling register function...');
        register(username, password);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-700 to-blue-950">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            placeholder="Enter your username"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
                <p className="text-blue-950 text-center mt-4">Do you have an account? <Link to="/login"className="text-blue-500">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;