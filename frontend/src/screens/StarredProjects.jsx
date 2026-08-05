import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

const StarredProjects = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStarred = async () => {
            try {
                // Fetch all projects to filter out starred ones, 
                // or ideally fetch from a dedicated endpoint.
                // Using existing /projects/all for simplicity.
                const res = await axios.get('/projects/all');
                const allProjects = res.data.projects || [];
                const starredIds = (user?.starredProjects || []).map(p => typeof p === 'object' ? p._id : p);
                
                setProjects(allProjects.filter(p => starredIds.includes(p._id)));
            } catch (err) {
                console.error("Failed to fetch starred projects", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStarred();
    }, [user]);

    const handleStar = async (projectId) => {
        // Unstarring removes it from this view optimistically
        const originalUser = { ...user };
        const originalProjects = [...projects];
        
        let newStarredProjects = (user.starredProjects || []).filter(id => {
            const pid = typeof id === 'object' ? id._id : id;
            return pid !== projectId;
        });
        
        setUser({ ...user, starredProjects: newStarredProjects });
        setProjects(projects.filter(p => p._id !== projectId));

        try {
            const res = await axios.put(`/projects/${projectId}/star`);
            setUser({ ...user, starredProjects: res.data.starredProjects });
        } catch (error) {
            console.error("Failed to unstar project", error);
            setUser(originalUser);
            setProjects(originalProjects);
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        
        const originalProjects = [...projects];
        setProjects(projects.filter(p => p._id !== projectId));

        try {
            await axios.delete(`/projects/${projectId}`);
        } catch (error) {
            console.error("Failed to delete project", error);
            setProjects(originalProjects);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBFF] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors">
            <header className="bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 p-6 flex items-center gap-4 sticky top-0 z-10 shadow-sm transition-colors">
                <button 
                    onClick={() => navigate('/home')}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h1 className="text-xl font-bold tracking-tight">Starred Projects</h1>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-12 animate-fade-in">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-xl p-6 h-48 animate-pulse"></div>
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                        {projects.map((project, index) => (
                            <ProjectCard 
                                key={project._id} 
                                project={project} 
                                index={index} 
                                isStarred={true}
                                onStar={() => handleStar(project._id)}
                                onDelete={() => handleDelete(project._id)}
                                onRename={null} // Requirements said ONLY Open, Unstar, Delete
                                onDuplicate={null}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-star-line text-5xl text-yellow-500"></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No starred projects yet.</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                            Start starring projects to find them quickly.
                        </p>
                        <button 
                            onClick={() => navigate('/home')}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium shadow-md transition-colors"
                        >
                            Go to Projects
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StarredProjects;
