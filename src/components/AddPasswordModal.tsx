import React, { useState } from 'react';

interface AddPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (passwordData: {
        title: string;
        username: string;
        password: string;
        website?: string;
        notes?: string;
    }) => void;
}

const AddPasswordModal = ({ isOpen, onClose, onSave }: AddPasswordModalProps) => {
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !username || !password) {
            alert('Please fill in all required fields');
            return;
        }

        onSave({
            title,
            username,
            password,
            website,
            notes
        });

        // Reset form
        setTitle('');
        setUsername('');
        setPassword('');
        setWebsite('');
        setNotes('');
        onClose();
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let generatedPassword = '';
        for (let i = 0; i < 16; i++) {
            generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(generatedPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
                    <h2 className="text-xl font-semibold">Add New Password</h2>
                    <p className="text-blue-100 text-sm">Store your password securely</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Gmail, Netflix, Bank Account"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username/Email *
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username or email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm font-medium"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website (optional)
                        </label>
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional information..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Save Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPasswordModal;