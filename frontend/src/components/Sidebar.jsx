import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, setIsModalOpen }) => {
    const navigate = useNavigate();
    const tabs = [
        { id: 'projects', label: 'Projects', icon: 'ri-folder-3-line' },
        { id: 'recent', label: 'Recent', icon: 'ri-time-line' },
        { id: 'starred', label: 'Starred', icon: 'ri-star-line' },
        { id: 'templates', label: 'Templates', icon: 'ri-layout-masonry-line' }
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-slate-800 flex-col hidden md:flex min-h-screen transition-colors">
            <div className="p-6 flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#5A52FF] rounded-md flex items-center justify-center">
                    <i className="ri-code-s-slash-line text-white"></i>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CollabCode</span>
            </div>

            <div className="px-4 mb-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#5A52FF] hover:bg-[#4942E6] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm shadow-[#5A52FF]/30"
                >
                    <i className="ri-add-line text-lg"></i>
                    New Project
                </button>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'starred') {
                                navigate('/starred');
                            } else {
                                setActiveTab(tab.id);
                            }
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left ${
                            activeTab === tab.id 
                                ? 'bg-[#F2F0FF] dark:bg-[#5A52FF]/10 text-[#5A52FF] dark:text-[#818CF8]' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <i className={`${tab.icon} text-lg`}></i>
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={() => navigate('/settings')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300`}
                >
                    <i className="ri-settings-3-line text-lg"></i>
                    Settings
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
