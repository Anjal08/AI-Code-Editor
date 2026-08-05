import React, { useState } from 'react';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import { useContext } from 'react';

const OnboardingModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useContext(UserContext);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put('/users/profile', {
                fullName,
                username,
                bio
            });
            setUser(res.data.user);
            onClose();
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in">
            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-md transform transition-all relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#F2F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-user-smile-line text-3xl text-[#5A52FF]"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Complete your profile</h2>
                    <p className="text-sm text-slate-500 mt-1">Let's set up your CollabCode workspace.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all shadow-sm" 
                            placeholder="e.g. Anjali Patel"
                            required 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                        <input
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all shadow-sm" 
                            placeholder="e.g. anjali08"
                            required 
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Bio (Optional)</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all shadow-sm resize-none" 
                            placeholder="Full stack developer passionate about React..."
                            rows={3}
                            maxLength={150}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !fullName || !username}
                        className="w-full px-5 py-3 bg-[#5A52FF] hover:bg-[#4942E6] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-md shadow-[#5A52FF]/20 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <i className="ri-loader-4-line animate-spin"></i>
                        ) : (
                            'Get Started'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingModal;
