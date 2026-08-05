import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import { ThemeContext } from '../context/ThemeContext';

const Avatar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const { theme, setTheme } = useContext(ThemeContext);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get('/users/logout');
            localStorage.removeItem('token');
            setUser(null);
            setShowLogoutModal(false);
            // Simulate a toast since we don't have a toast library setup right now
            alert("Logged out successfully.");
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        setIsOpen(false);
    };

    const displayLetter = user?.fullName 
        ? user.fullName.charAt(0).toUpperCase() 
        : user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:ring-4 ring-[#F2F0FF] dark:ring-slate-800 transition-all overflow-hidden"
            >
                {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    displayLetter
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1F2937] rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 mb-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <button 
                        onClick={() => { setIsOpen(false); navigate('/profile'); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                    >
                        <i className="ri-user-line text-slate-400 dark:text-slate-500"></i>
                        My Profile
                    </button>

                    <button 
                        onClick={() => { setIsOpen(false); navigate('/settings'); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                    >
                        <i className="ri-settings-3-line text-slate-400 dark:text-slate-500"></i>
                        Settings
                    </button>

                    <button 
                        onClick={() => { setIsOpen(false); navigate('/starred'); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                    >
                        <i className="ri-star-line text-slate-400 dark:text-slate-500"></i>
                        Starred Projects
                    </button>

                    <button 
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                    >
                        <i className={theme === 'dark' ? "ri-sun-line text-slate-400 dark:text-slate-500" : "ri-moon-line text-slate-400 dark:text-slate-500"}></i>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <div className="border-t border-slate-50 dark:border-slate-700/50 mt-1 pt-1">
                        <button 
                            onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                            <i className="ri-logout-box-r-line"></i>
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100] animate-fade-in p-4">
                    <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all text-center">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-logout-box-r-line text-3xl text-red-500"></i>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Logout</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Are you sure you want to logout?</p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2.5 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-md shadow-red-500/20 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Avatar;
