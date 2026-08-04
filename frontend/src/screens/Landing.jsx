import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
            {/* Navbar */}
            <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/20">
                        <i className="ri-code-s-slash-line text-2xl text-white"></i>
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-white">CollabCode</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors">Login</Link>
                    <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 -mt-10">
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 animate-fade-in">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-sm font-medium text-indigo-300">AI-Powered Real-Time Collaboration</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-center max-w-5xl leading-tight tracking-tight mb-8">
                    Code together. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 animate-gradient">Ship faster with AI.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mb-12 leading-relaxed">
                    A collaborative, in-browser code editor built for modern teams. Chat in real-time, instantly generate code with AI, and run full-stack apps directly in your browser.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                        Start Coding Free
                        <i className="ri-arrow-right-line"></i>
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Mockup Preview Section */}
            <div className="w-full max-w-6xl mx-auto px-4 pb-20 relative z-10">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-2 backdrop-blur-xl shadow-2xl shadow-indigo-900/20 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="rounded-xl border border-slate-700/50 bg-slate-950 overflow-hidden aspect-video relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0"></div>
                        <div className="z-10 text-center">
                            <i className="ri-terminal-window-fill text-6xl text-indigo-400 mb-4 block opacity-80"></i>
                            <h3 className="text-2xl font-bold text-slate-200">Your AI Workspace Awaits</h3>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Landing
