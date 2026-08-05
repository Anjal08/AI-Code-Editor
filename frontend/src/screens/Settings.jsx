import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get('/users/logout');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await axios.delete('/users');
            localStorage.removeItem('token');
            setUser(null);
            setShowDeleteModal(false);
            navigate('/');
        } catch (error) {
            console.error('Delete account failed:', error);
            alert('Failed to delete account');
            setIsDeleting(false);
        }
    };

    const displayLetter = user?.fullName 
        ? user.fullName.charAt(0).toUpperCase() 
        : user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen bg-[#FAFBFF] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors">
            <header className="bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 p-6 flex items-center gap-4 sticky top-0 z-10 shadow-sm transition-colors">
                <button 
                    onClick={() => navigate('/home')}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h1 className="text-xl font-bold tracking-tight">Settings</h1>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-12 animate-fade-in space-y-10">
                
                {/* 1. Profile Shortcut */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Profile</h2>
                    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold text-xl shadow-md overflow-hidden">
                                {user?.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    displayLetter
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">{user?.fullName || 'User'}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">@{user?.username || 'username'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                </section>

                {/* 2. Appearance */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Appearance</h2>
                    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
                        <button 
                            onClick={() => setTheme('light')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <i className="ri-sun-line"></i>
                                </div>
                                <span className="font-medium">Light Mode</span>
                            </div>
                            {theme === 'light' && <i className="ri-check-line text-indigo-600 text-xl"></i>}
                        </button>
                        
                        <button 
                            onClick={() => setTheme('dark')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <i className="ri-moon-line"></i>
                                </div>
                                <span className="font-medium">Dark Mode</span>
                            </div>
                            {theme === 'dark' && <i className="ri-check-line text-indigo-600 text-xl"></i>}
                        </button>
                        
                        <button 
                            onClick={() => setTheme('system')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center">
                                    <i className="ri-computer-line"></i>
                                </div>
                                <span className="font-medium">System Default</span>
                            </div>
                            {theme === 'system' && <i className="ri-check-line text-indigo-600 text-xl"></i>}
                        </button>
                    </div>
                </section>

                {/* 3. About CollabCode */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">About</h2>
                    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-16 h-16 bg-[#5A52FF] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                            <i className="ri-code-s-slash-line text-3xl text-white"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">CollabCode</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Version 1.0.0</p>
                            
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Built with</div>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">React</span>
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">Node.js</span>
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">Socket.IO</span>
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">MongoDB</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Account */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Account</h2>
                    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        >
                            <i className="ri-logout-box-r-line mr-3 text-slate-400"></i>
                            <span className="font-medium">Logout</span>
                        </button>
                        
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                        >
                            <i className="ri-delete-bin-line mr-3"></i>
                            <span className="font-medium">Delete Account</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in p-4">
                    <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all text-center">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-error-warning-fill text-3xl text-red-500"></i>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete your projects and data.
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md shadow-red-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {isDeleting ? <i className="ri-loader-4-line animate-spin"></i> : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
