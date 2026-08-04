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
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-2 backdrop-blur-xl shadow-2xl shadow-indigo-900/20 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="rounded-xl border border-slate-800 bg-[#0f111a] overflow-hidden flex flex-col md:flex-row h-[400px] md:h-[500px]">
                        
                        {/* Explorer Panel */}
                        <div className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-[#141622]">
                            <div className="p-4 flex items-center justify-between border-b border-slate-800">
                                <span className="text-sm font-semibold text-slate-300">Explorer</span>
                                <i className="ri-more-fill text-slate-500"></i>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 text-sm text-slate-400">
                                <div className="flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded cursor-pointer">
                                    <i className="ri-folder-3-fill text-slate-400"></i>
                                    <span>src</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 pl-6 hover:bg-slate-800/50 rounded cursor-pointer">
                                    <i className="ri-folder-3-fill text-slate-400"></i>
                                    <span>components</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 pl-6 bg-indigo-600/10 text-indigo-300 rounded cursor-pointer border border-indigo-500/20">
                                    <i className="ri-reactjs-line text-cyan-400"></i>
                                    <span>App.jsx</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 pl-6 hover:bg-slate-800/50 rounded cursor-pointer">
                                    <i className="ri-javascript-line text-yellow-400"></i>
                                    <span>index.js</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 pl-6 hover:bg-slate-800/50 rounded cursor-pointer">
                                    <i className="ri-css3-line text-blue-400"></i>
                                    <span>styles.css</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 hover:bg-slate-800/50 rounded cursor-pointer">
                                    <i className="ri-npmjs-line text-red-400"></i>
                                    <span>package.json</span>
                                </div>
                            </div>
                        </div>

                        {/* Editor Panel */}
                        <div className="flex-1 flex flex-col bg-[#0f111a]">
                            <div className="flex items-center bg-[#141622] border-b border-slate-800 pt-2 px-2">
                                <div className="px-4 py-2 border-x border-t border-slate-800 bg-[#0f111a] text-indigo-300 text-sm flex items-center gap-2 rounded-t-md">
                                    <i className="ri-reactjs-line text-cyan-400"></i>
                                    App.jsx
                                    <i className="ri-close-line text-slate-500 hover:text-slate-300 ml-2"></i>
                                </div>
                            </div>
                            <div className="flex-1 p-4 font-mono text-sm overflow-hidden relative">
                                <div className="flex">
                                    <div className="text-slate-600 select-none pr-4 text-right flex flex-col gap-1 w-8">
                                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div><span className="text-pink-400">import</span> <span className="text-cyan-300">React</span> <span className="text-pink-400">from</span> <span className="text-green-300">'react'</span></div>
                                        <div></div>
                                        <div><span className="text-pink-400">export default function</span> <span className="text-indigo-300">App</span>() {'{'}</div>
                                        <div className="pl-4"><span className="text-pink-400">return</span> (</div>
                                        <div className="pl-8"><span className="text-slate-400">&lt;</span><span className="text-pink-400">div</span> <span className="text-indigo-300">className</span><span className="text-slate-400">=</span><span className="text-green-300">"app"</span><span className="text-slate-400">&gt;</span></div>
                                        <div className="pl-12"><span className="text-slate-400">&lt;</span><span className="text-pink-400">h1</span><span className="text-slate-400">&gt;</span><span className="text-slate-100">CollabCode</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">h1</span><span className="text-slate-400">&gt;</span></div>
                                        <div className="pl-12"><span className="text-slate-400">&lt;</span><span className="text-pink-400">p</span><span className="text-slate-400">&gt;</span><span className="text-slate-100">Code together. Ship faster with AI.</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">p</span><span className="text-slate-400">&gt;</span></div>
                                        <div className="pl-8"><span className="text-slate-400">&lt;/</span><span className="text-pink-400">div</span><span className="text-slate-400">&gt;</span></div>
                                        <div className="pl-4">)</div>
                                        <div>{'}'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Panel */}
                        <div className="hidden lg:flex flex-col w-80 border-l border-slate-800 bg-[#141622]">
                            <div className="p-4 flex items-center justify-between border-b border-slate-800">
                                <span className="text-sm font-semibold text-slate-300">AI Assistant</span>
                                <i className="ri-list-check-2 text-slate-500"></i>
                            </div>
                            <div className="flex-1 p-4 flex flex-col gap-4">
                                <div className="text-sm text-slate-400">How can I help you code today?</div>
                            </div>
                            <div className="p-4">
                                <div className="relative">
                                    <input type="text" placeholder="Ask anything..." className="w-full bg-[#0f111a] border border-slate-700 rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" readOnly />
                                    <div className="absolute right-2 top-2 w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
                                        <i className="ri-magic-line text-xs text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Landing
