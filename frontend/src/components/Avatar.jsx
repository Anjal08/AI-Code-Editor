import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const Avatar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

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
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const displayLetter = user?.fullName 
        ? user.fullName.charAt(0).toUpperCase() 
        : user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:ring-4 ring-[#F2F0FF] transition-all overflow-hidden"
            >
                {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    displayLetter
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <button 
                        onClick={() => { setIsOpen(false); navigate('/profile'); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                        <i className="ri-user-line text-slate-400"></i>
                        My Profile
                    </button>

                    <button 
                        onClick={() => { setIsOpen(false); /* navigate('/settings') */ }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                        <i className="ri-settings-3-line text-slate-400"></i>
                        Settings
                    </button>

                    <button 
                        onClick={() => { setIsOpen(false); /* Handle Starred */ }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                        <i className="ri-star-line text-slate-400"></i>
                        Starred Projects
                    </button>

                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                    >
                        <i className="ri-moon-line text-slate-400"></i>
                        Dark Mode
                    </button>

                    <div className="border-t border-slate-50 mt-1 pt-1">
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <i className="ri-logout-box-r-line"></i>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Avatar;
