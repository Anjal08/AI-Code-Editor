import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, index, onStar, onDelete, onRename, onDuplicate, isStarred }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const colors = ['bg-[#EBE9FE] text-[#5A52FF]', 'bg-[#D1F4E0] text-[#14804A]', 'bg-[#FEF0C7] text-[#B54708]'];
    const colorClass = colors[index % colors.length];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const timeAgo = (dateString) => {
        if (!dateString) return 'Updated recently';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const handleMenuAction = (e, action) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        action();
    };

    return (
        <div 
            onClick={() => navigate(`/project`, { state: { project } })}
            className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-300 flex flex-col shadow-sm group relative"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <i className="ri-code-s-slash-line text-2xl"></i>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onStar(); }}
                        className={`p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isStarred ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'}`}
                        title={isStarred ? "Remove from Starred" : "Star Project"}
                    >
                        <i className={`text-xl ${isStarred ? 'ri-star-fill' : 'ri-star-line'}`}></i>
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="ri-arrow-right-up-line text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"></i>
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate">{project.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 line-clamp-1">
                {project.description || `${project.collaborators?.length || 0} Collaborator${(project.collaborators?.length || 0) !== 1 ? 's' : ''}`}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>{project.language || 'JavaScript'}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{timeAgo(project.lastOpenedAt)}</span>
                </div>
                
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        className="hover:text-slate-700 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <i className="ri-more-2-fill text-lg"></i>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 bottom-8 w-40 bg-white dark:bg-[#1F2937] rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-10 animate-fade-in origin-bottom-right">
                            {onRename && (
                                <button 
                                    onClick={(e) => handleMenuAction(e, onRename)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                                >
                                    <i className="ri-edit-line text-slate-400"></i> Rename
                                </button>
                            )}
                            {onDuplicate && (
                                <button 
                                    onClick={(e) => handleMenuAction(e, onDuplicate)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                                >
                                    <i className="ri-file-copy-line text-slate-400"></i> Duplicate
                                </button>
                            )}
                            {(onRename || onDuplicate) && <div className="border-t border-slate-50 dark:border-slate-700 my-1"></div>}
                            <button 
                                onClick={(e) => handleMenuAction(e, onDelete)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <i className="ri-delete-bin-line"></i> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
