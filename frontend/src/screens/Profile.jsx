import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                username: user.username || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put('/users/profile', formData);
            setUser(res.data.user);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

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
                <h1 className="text-xl font-bold tracking-tight">Profile</h1>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-12 animate-fade-in">
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm transition-colors">
                    
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold text-4xl shadow-md mb-4 overflow-hidden">
                            {user.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                displayLetter
                            )}
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{user.fullName || 'Complete your profile'}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">@{user.username || 'username'}</p>
                    </div>

                    {!isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">About</h3>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {user.bio || 'No bio provided yet.'}
                                </p>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Account Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Email</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400">Joined</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {new Date(user.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full py-2.5 mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="ri-edit-line"></i> Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <input
                                    type="text" 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full p-3 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A52FF]/50 transition-all" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                                <input
                                    type="text" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full p-3 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A52FF]/50 transition-all" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <input
                                    type="email" 
                                    value={user.email}
                                    disabled
                                    className="w-full p-3 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-500 cursor-not-allowed" 
                                />
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full p-3 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A52FF]/50 transition-all resize-none" 
                                    rows={4}
                                    maxLength={150}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            fullName: user.fullName || '',
                                            username: user.username || '',
                                            bio: user.bio || ''
                                        });
                                    }}
                                    className="flex-1 py-2.5 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors" 
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-[#5A52FF] hover:bg-[#4942E6] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <i className="ri-loader-4-line animate-spin"></i> : 'Save'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;
