import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import ProjectCard from '../components/ProjectCard';
import OnboardingModal from '../components/OnboardingModal';

const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('projects');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Ensure the user has completed their profile
    const [showOnboarding, setShowOnboarding] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && (!user.fullName || !user.username)) {
            setShowOnboarding(true);
        } else {
            setShowOnboarding(false);
        }
    }, [user]);

    // Fetch user profile on mount to get latest starred projects etc.
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/users/profile');
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        if (user?.email) fetchProfile();
    }, []);

    // Fetch Projects with debounced search
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/projects/all${searchQuery ? `?search=${searchQuery}` : ''}`);
                setProjects(res.data.projects);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProjects();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const createProject = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/projects/create', { name: projectName });
            setIsModalOpen(false);
            setProjectName('');
            setProjects([res.data, ...projects]); // Add to top since it's most recent
        } catch (error) {
            console.error(error);
            alert("Failed to create project");
        }
    };

    const handleStar = async (projectId) => {
        try {
            const res = await axios.put(`/projects/${projectId}/star`);
            // Update user context with new starred projects
            setUser({ ...user, starredProjects: res.data.starredProjects });
        } catch (error) {
            console.error("Failed to star project", error);
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`/projects/${projectId}`);
            setProjects(projects.filter(p => p._id !== projectId));
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    const handleRename = async (projectId) => {
        const newName = window.prompt("Enter new project name:");
        if (!newName) return;
        try {
            const res = await axios.put(`/projects/${projectId}/rename`, { name: newName });
            setProjects(projects.map(p => p._id === projectId ? res.data.project : p));
        } catch (error) {
            console.error("Failed to rename project", error);
        }
    };

    const handleDuplicate = async (projectId) => {
        try {
            const res = await axios.post(`/projects/${projectId}/duplicate`);
            setProjects([res.data, ...projects]);
        } catch (error) {
            console.error("Failed to duplicate project", error);
        }
    };

    // Derived state for filtering based on active tab
    const getFilteredProjects = () => {
        let filtered = projects;
        
        if (activeTab === 'recent') {
            filtered = projects.slice(0, 10); // Since backend sorts by lastOpenedAt DESC
        } else if (activeTab === 'starred') {
            const starredIds = (user?.starredProjects || []).map(p => typeof p === 'object' ? p._id : p);
            filtered = projects.filter(p => starredIds.includes(p._id));
        } else if (activeTab === 'shared') {
            filtered = projects.filter(p => {
                const myCollab = p.collaborators?.find(c => c.user === user._id);
                return myCollab && myCollab.role !== 'Owner';
            });
        }

        return filtered;
    };

    const filteredProjects = getFilteredProjects();

    const isStarred = (projectId) => {
        const starredIds = (user?.starredProjects || []).map(p => typeof p === 'object' ? p._id : p);
        return starredIds.includes(projectId);
    };

    return (
        <main className="min-h-screen bg-[#FAFBFF] text-slate-900 flex font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setIsModalOpen={setIsModalOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Good Morning, {user?.fullName?.split(' ')[0] || user?.username || 'Developer'} 👋</p>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Today's focus: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">"Continue building amazing things."</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-colors relative">
                            <i className="ri-notification-3-line text-xl"></i>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <Avatar user={user} />
                    </div>
                </header>

                <div className="p-8 pt-6 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                            {activeTab === 'projects' ? 'All Projects' : activeTab}
                        </h2>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects..." 
                                className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5A52FF]/20 focus:border-[#5A52FF] text-sm w-64 shadow-sm"
                            />
                            <i className="ri-search-line absolute right-3 top-2.5 text-slate-400"></i>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 h-48 animate-pulse">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg mb-6"></div>
                                    <div className="w-3/4 h-5 bg-slate-100 rounded mb-2"></div>
                                    <div className="w-1/2 h-4 bg-slate-100 rounded mb-6"></div>
                                    <div className="w-full h-8 bg-slate-50 rounded mt-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard 
                                    key={project._id} 
                                    project={project} 
                                    index={index} 
                                    isStarred={isStarred(project._id)}
                                    onStar={() => handleStar(project._id)}
                                    onDelete={() => handleDelete(project._id)}
                                    onRename={() => handleRename(project._id)}
                                    onDuplicate={() => handleDuplicate(project._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                <i className="ri-folder-open-line text-6xl text-indigo-200"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No projects found</h3>
                            <p className="text-slate-500 max-w-sm mb-6">
                                {searchQuery 
                                    ? `We couldn't find any projects matching "${searchQuery}".` 
                                    : "You don't have any projects here yet. Create one to get started."}
                            </p>
                            {!searchQuery && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-2.5 bg-[#5A52FF] text-white rounded-lg font-medium shadow-md hover:bg-[#4942E6] transition-colors"
                                >
                                    Create Project
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in">
                    <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-md transform transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName || ''}
                                    type="text" 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#5A52FF]/10 focus:border-[#5A52FF] transition-all shadow-sm" 
                                    placeholder="e.g. My Awesome App"
                                    required 
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    type="button" 
                                    className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors shadow-sm" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-[#5A52FF] hover:bg-[#4942E6] text-white rounded-xl font-medium shadow-md shadow-[#5A52FF]/20 transition-all"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </main>
    );
};

export default Home;