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
        <main className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 flex flex-col items-center py-12 px-4 font-sans'>
            {/* Header section */}
            <div className="w-full max-w-6xl flex flex-col items-center mb-16 mt-8 animate-fade-in">
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform transition-transform hover:scale-105 border border-indigo-400/20">
                    <i className="ri-code-s-slash-line text-4xl text-white"></i>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 mb-4 text-center tracking-tight">
                    AI Code Workspace
                </h1>
                <p className="text-slate-400 text-lg text-center max-w-xl">
                    Create, collaborate, and generate code with AI in real-time. Select a project below or start a new one to dive in.
                </p>
            </div>

            <div className="w-full max-w-6xl">
                <div className="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* New Project Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group project p-6 flex flex-col items-center justify-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all duration-300 ease-out shadow-lg hover:shadow-indigo-500/20 h-48"
                    >
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500/40 transition-colors">
                            <i className="ri-add-line text-3xl text-indigo-300 group-hover:text-white"></i>
                        </div>
                        <span className="font-semibold text-lg text-indigo-200 group-hover:text-white transition-colors">New Project</span>
                    </button>

                    {/* Existing Projects */}
                    {
                        project.map((project) => (
                            <div key={project._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project }
                                    })
                                }}
                                className="project flex flex-col justify-between p-6 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl cursor-pointer hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg h-48 group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                            <i className="ri-folder-open-fill text-xl text-slate-300 group-hover:text-indigo-300"></i>
                                        </div>
                                        <i className="ri-arrow-right-up-line text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-xl"></i>
                                    </div>
                                    <h2 className='text-xl font-bold text-slate-100 mb-2 truncate'>
                                        {project.name}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 w-fit px-3 py-1.5 rounded-full">
                                    <i className="ri-group-line text-indigo-400"></i>
                                    <span>{project.users.length} Collaborator{project.users.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
                    <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName || ''}
                                    type="text" 
                                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                    placeholder="e.g. My Awesome App"
                                    required 
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    type="button" 
                                    className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all"
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