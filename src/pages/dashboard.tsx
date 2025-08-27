import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate} from 'react-router-dom';
import AddPasswordModal from '../components/AddPasswordModal';

interface Password {
    id: string;
    title: string;
    username: string;
    password: string;
    website?: string;
    notes?: string;
    createdAt: string;
}

const Dashboard = ({ loggedIn, setLoggedIn }: { loggedIn: boolean; setLoggedIn: (loggedIn: boolean) => void }) => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    const handleLogout = () => {
        // Clear localStorage first
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        
        // Update state - this will trigger the redirect automatically
        setLoggedIn(false);
        
        // Remove the manual navigation - let the redirect handle it
        // setTimeout(() => {
        //     navigate('/login');
        // }, 100);
    };

    const handleSavePassword = (passwordData: any) => {
        const newPassword: Password = {
            id: Date.now().toString(),
            ...passwordData,
            createdAt: new Date().toISOString()
        };
        
        setPasswords(prev => [newPassword, ...prev]);
        setShowAddModal(false);
    };

    const togglePasswordVisibility = (id: string) => {
        setShowPassword(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const deletePassword = (id: string) => {
        if (window.confirm('Are you sure you want to delete this password?')) {
            setPasswords(prev => prev.filter(p => p.id !== id));
        }
    };

    // Security functions
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 1;
        else feedback.push('At least 8 characters');

        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Include lowercase letters');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Include uppercase letters');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Include numbers');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Include special characters');

        if (password.length >= 12) score += 1;

        if (score <= 2) return { strength: 'Weak', color: 'text-red-400', bgColor: 'bg-red-900/20', score };
        if (score <= 4) return { strength: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-900/20', score };
        if (score <= 5) return { strength: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-900/20', score };
        return { strength: 'Strong', color: 'text-green-400', bgColor: 'bg-green-900/20', score };
    };

    const getSecurityScore = () => {
        if (passwords.length === 0) return 100;
        
        let totalScore = 0;
        passwords.forEach(pwd => {
            const strength = checkPasswordStrength(pwd.password);
            totalScore += strength.score;
        });
        
        return Math.round((totalScore / (passwords.length * 6)) * 100);
    };

    const getSecurityStatus = () => {
        const score = getSecurityScore();
        if (score >= 80) return { status: 'Excellent', color: 'text-green-400', icon: '🛡️' };
        if (score >= 60) return { status: 'Good', color: 'text-blue-400', icon: '🔒' };
        if (score >= 40) return { status: 'Fair', color: 'text-yellow-400', icon: '⚠️' };
        return { status: 'Poor', color: 'text-red-400', icon: '🚨' };
    };

    const getWeakPasswords = () => {
        return passwords.filter(pwd => {
            const strength = checkPasswordStrength(pwd.password);
            return strength.score <= 3;
        });
    };

    const getDuplicatePasswords = () => {
        const passwordCounts: { [key: string]: string[] } = {};
        passwords.forEach(pwd => {
            if (!passwordCounts[pwd.password]) {
                passwordCounts[pwd.password] = [];
            }
            passwordCounts[pwd.password].push(pwd.title);
        });
        
        return Object.entries(passwordCounts)
            .filter(([_, titles]) => titles.length > 1)
            .map(([password, titles]) => ({ password, titles }));
    };

    const filteredPasswords = passwords.filter(password =>
        password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (password.website && password.website.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Redirect to login if not logged in
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }

    const securityScore = getSecurityScore();
    const securityStatus = getSecurityStatus();
    const weakPasswords = getWeakPasswords();
    const duplicatePasswords = getDuplicatePasswords();

    // Only show dashboard content if logged in
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
            {/* Header */}
            <div className={`bg-blue-950 shadow-lg border-b border-blue-800 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-white transform transition-all duration-500 hover:scale-105">Password Manager</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-blue-100 bg-blue-800 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-blue-700">
                                Welcome, {localStorage.getItem('username') || 'User'}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Welcome Section */}
                <div className="bg-blue-950 rounded-xl shadow-lg border border-blue-800 p-6 mb-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                    <h2 className="text-2xl font-semibold text-white mb-2">Welcome back!</h2>
                    <p className="text-blue-100">Manage your passwords securely</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="relative max-w-md">
                        <input 
                            type="search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search passwords..." 
                            className="w-full bg-blue-950 border border-gray-300 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl" 
                        />
                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:from-blue-600 hover:to-blue-700">
                        <h3 className="text-lg font-semibold mb-2">Add New Password</h3>
                        <p className="text-blue-100 mb-4">Store a new password securely</p>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                        >
                            Add Password
                        </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700">
                        <h3 className="text-lg font-semibold mb-2">Total Passwords</h3>
                        <p className="text-emerald-100 mb-4">{passwords.length} passwords stored</p>
                        <div className="text-3xl font-bold text-white transform transition-all duration-500 hover:scale-110">{passwords.length}</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-purple-700">
                        <h3 className="text-lg font-semibold mb-2">Security Status</h3>
                        <p className="text-purple-100 mb-4">Overall security score</p>
                        <div className={`text-2xl font-bold ${securityStatus.color} transform transition-all duration-500 hover:scale-110`}>
                            {securityStatus.icon} {securityStatus.status}
                        </div>
                        <div className="text-sm text-purple-200 mt-1">{securityScore}/100</div>
                    </div>
                </div>

                {/* Security Overview */}
                <div className="bg-blue-950 rounded-xl shadow-lg border border-blue-800 p-6 mb-8 transform transition-all duration-500 hover:shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <span className="mr-2">🔒</span>
                        Security Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Security Score */}
                        <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{securityScore}</div>
                                <div className="text-blue-200 text-sm">Security Score</div>
                                <div className="w-full bg-blue-800 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${securityScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Weak Passwords */}
                        <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                            <div className="text-center">
                                <div className={`text-2xl font-bold mb-1 ${weakPasswords.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {weakPasswords.length}
                                </div>
                                <div className="text-blue-200 text-sm">Weak Passwords</div>
                                {weakPasswords.length > 0 && (
                                    <div className="text-xs text-red-300 mt-1">Needs attention</div>
                                )}
                            </div>
                        </div>

                        {/* Duplicate Passwords */}
                        <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                            <div className="text-center">
                                <div className={`text-2xl font-bold mb-1 ${duplicatePasswords.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                    {duplicatePasswords.length}
                                </div>
                                <div className="text-blue-200 text-sm">Duplicates</div>
                                {duplicatePasswords.length > 0 && (
                                    <div className="text-xs text-yellow-300 mt-1">Security risk</div>
                                )}
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {passwords.length > 0 ? '✓' : '⚠️'}
                                </div>
                                <div className="text-blue-200 text-sm">Status</div>
                                <div className="text-xs text-blue-300 mt-1">
                                    {passwords.length > 0 ? 'Protected' : 'No passwords'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Recommendations */}
                    {(weakPasswords.length > 0 || duplicatePasswords.length > 0) && (
                        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3">🔍 Security Recommendations</h3>
                            <div className="space-y-2">
                                {weakPasswords.length > 0 && (
                                    <div className="flex items-center text-yellow-300">
                                        <span className="mr-2">⚠️</span>
                                        <span>Consider strengthening {weakPasswords.length} weak password(s)</span>
                                    </div>
                                )}
                                {duplicatePasswords.length > 0 && (
                                    <div className="flex items-center text-yellow-300">
                                        <span className="mr-2">⚠️</span>
                                        <span>Found {duplicatePasswords.length} duplicate password(s) - use unique passwords for each account</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Password List */}
                <div className="bg-blue-950 rounded-xl shadow-lg border border-blue-800 p-6 transform transition-all duration-500 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Your Passwords</h2>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                        >
                            + Add New
                        </button>
                    </div>
                    
                    {filteredPasswords.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12 transform transition-all duration-500 hover:scale-105">
                            <div className="mx-auto h-12 w-12 text-gray-400 transform transition-all duration-500 hover:scale-110">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-white">No passwords yet</h3>
                            <p className="mt-1 text-sm text-blue-100">Get started by adding your first password.</p>
                            <div className="mt-6">
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                                >
                                    Add Password
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Password List */
                        <div className="space-y-4">
                            {filteredPasswords.map((password, index) => {
                                const strength = checkPasswordStrength(password.password);
                                return (
                                    <div 
                                        key={password.id} 
                                        className="bg-blue-900 rounded-lg p-4 border border-blue-800 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-blue-600"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-white transform transition-all duration-300 hover:scale-105">{password.title}</h3>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${strength.bgColor} ${strength.color}`}>
                                                        {strength.strength}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="transform transition-all duration-300 hover:scale-105">
                                                        <span className="text-blue-200">Username:</span>
                                                        <span className="text-white ml-2">{password.username}</span>
                                                    </div>
                                                    <div className="transform transition-all duration-300 hover:scale-105">
                                                        <span className="text-blue-200">Password:</span>
                                                        <div className="flex items-center mt-1">
                                                            <input
                                                                type={showPassword[password.id] ? "text" : "password"}
                                                                value={password.password}
                                                                readOnly
                                                                className="bg-blue-800 text-white px-3 py-1 rounded border border-blue-700 text-sm mr-2 transition-all duration-300 hover:bg-blue-700 focus:bg-blue-700"
                                                            />
                                                            <button
                                                                onClick={() => togglePasswordVisibility(password.id)}
                                                                className="text-blue-300 hover:text-white text-sm transition-all duration-300 transform hover:scale-110"
                                                            >
                                                                {showPassword[password.id] ? 'Hide' : 'Show'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {password.website && (
                                                        <div className="transform transition-all duration-300 hover:scale-105">
                                                            <span className="text-blue-200">Website:</span>
                                                            <a 
                                                                href={password.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-400 hover:text-blue-300 ml-2 underline transition-all duration-300 hover:text-blue-200"
                                                            >
                                                                {password.website}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {password.notes && (
                                                        <div className="transform transition-all duration-300 hover:scale-105">
                                                            <span className="text-blue-200">Notes:</span>
                                                            <span className="text-white ml-2">{password.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-blue-300 mt-2 transform transition-all duration-300 hover:scale-105">
                                                    Added: {new Date(password.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => deletePassword(password.id)}
                                                    className="text-red-400 hover:text-red-300 p-1 transition-all duration-300 transform hover:scale-110 hover:bg-red-900 rounded"
                                                    title="Delete password"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Password Modal */}
            {showAddModal && (
                <AddPasswordModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSavePassword}
                />
            )}
        </div>
    );
};

export default Dashboard;