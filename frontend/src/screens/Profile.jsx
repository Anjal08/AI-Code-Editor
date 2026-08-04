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
        <div className="min-h-screen bg-[#FAFBFF] text-slate-900 font-sans">
            <header className="bg-white border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/home')}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Your Profile</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8 pt-12">
                <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm mb-8 flex items-start gap-8">
                    <div className="w-32 h-32 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold text-5xl shadow-lg flex-shrink-0">
                        {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            displayLetter
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{user.fullName || 'Complete your profile'}</h2>
                                <p className="text-slate-500">@{user.username || 'username'}</p>
                            </div>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <i className="ri-edit-line"></i> Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <p className="text-slate-600 max-w-2xl mb-6">
                            {user.bio || 'No bio provided yet.'}
                        </p>

                        <div className="flex items-center gap-6 text-sm font-medium text-slate-500 border-t border-slate-50 pt-6">
                            <div className="flex items-center gap-2">
                                <i className="ri-mail-line text-slate-400"></i>
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="ri-calendar-line text-slate-400"></i>
                                Joined {new Date(user.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm animate-fade-in">
                        <h3 className="text-xl font-bold mb-6">Edit Details</h3>
                        <form onSubmit={handleSubmit} className="max-w-2xl">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                                    <input
                                        type="text" 
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all resize-none" 
                                    rows={4}
                                    maxLength={150}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-[#5A52FF] hover:bg-[#4942E6] text-white rounded-lg font-medium shadow-md shadow-[#5A52FF]/20 transition-all flex items-center gap-2 disabled:bg-slate-300"
                                >
                                    {loading ? <i className="ri-loader-4-line animate-spin"></i> : 'Save Changes'}
                                </button>
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
                                    className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors shadow-sm" 
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
