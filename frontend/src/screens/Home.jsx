import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState(null)
    const [ project, setProject ] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <main className="min-h-screen bg-[#FAFBFF] text-slate-900 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex min-h-screen">
                <div className="p-6 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#5A52FF] rounded-md flex items-center justify-center">
                        <i className="ri-code-s-slash-line text-white"></i>
                    </div>
                    <span className="font-bold text-xl tracking-tight">CollabCode</span>
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
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#F2F0FF] text-[#5A52FF] rounded-lg font-medium">
                        <i className="ri-folder-3-line text-lg"></i>
                        Projects
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg font-medium transition-colors">
                        <i className="ri-time-line text-lg"></i>
                        Recent
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg font-medium transition-colors">
                        <i className="ri-star-line text-lg"></i>
                        Starred
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg font-medium transition-colors">
                        <i className="ri-team-line text-lg"></i>
                        Shared with me
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg font-medium transition-colors">
                        <i className="ri-layout-masonry-line text-lg"></i>
                        Templates
                    </a>
                </nav>

                <div className="p-4 mt-auto">
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg font-medium transition-colors">
                        <i className="ri-settings-3-line text-lg"></i>
                        Settings
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                            Welcome back, {user?.email ? user.email.split('@')[0] : 'User'} <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Let's build something amazing today!</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#3B28CC] text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:ring-4 ring-[#F2F0FF] transition-all">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                </header>

                <div className="p-8 pt-6 flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Your Projects</h2>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5A52FF]/20 focus:border-[#5A52FF] text-sm w-64 shadow-sm"
                            />
                            <i className="ri-search-line absolute right-3 top-2.5 text-slate-400"></i>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {
                            project.map((project, index) => {
                                const colors = ['bg-[#EBE9FE] text-[#5A52FF]', 'bg-[#D1F4E0] text-[#14804A]', 'bg-[#FEF0C7] text-[#B54708]'];
                                const colorClass = colors[index % colors.length];

                                return (
                                    <div key={project._id}
                                        onClick={() => {
                                            navigate(`/project`, {
                                                state: { project }
                                            })
                                        }}
                                        className="bg-white border border-slate-100 rounded-xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col shadow-sm group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                                                <i className="ri-code-s-slash-line text-2xl"></i>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <i className="ri-arrow-right-up-line text-slate-400 hover:text-slate-700"></i>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{project.name}</h3>
                                        <p className="text-slate-500 text-sm font-medium mb-6">
                                            {project.users.length} Collaborator{project.users.length !== 1 ? 's' : ''}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
                                            <span>Real-time code editor</span>
                                            <button className="hover:text-slate-700 p-1">
                                                <i className="ri-more-2-fill text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* Modal */}
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
        </main>
    )
}

export default Home