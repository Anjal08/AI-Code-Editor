import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage, disconnectSocket } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'
import { Panel, Group, Separator } from 'react-resizable-panels'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const webContainerRef = useRef(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)
    const [ isIframeLoading, setIsIframeLoading ] = useState(false)

    const [ runProcess, setRunProcess ] = useState(null)
    const [ runProcessLogs, setRunProcessLogs ] = useState([])

    const terminalRef = useRef(null)
    const xtermRef = useRef(null)
    const shellProcessRef = useRef(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
            // Refresh project to get populated collaborators
            axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
                setProject(res.data.project)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user,
            fileTree
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")

    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {

        initializeSocket(project._id)

        if (!xtermRef.current && terminalRef.current) {
            const term = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#0f172a',
                    foreground: '#f8fafc',
                },
                fontFamily: 'monospace',
                fontSize: 14,
            });
            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(terminalRef.current);
            fitAddon.fit();
            xtermRef.current = { term, fitAddon };
            
            const resizeObserver = new ResizeObserver(() => {
                fitAddon.fit();
                if (shellProcessRef.current) {
                    shellProcessRef.current.resize({
                        cols: term.cols,
                        rows: term.rows,
                    });
                }
            });
            resizeObserver.observe(terminalRef.current);
            xtermRef.current.resizeObserver = resizeObserver;
        }

        if (!webContainer) {
            getWebContainer().then(async container => {
                setWebContainer(container)
                webContainerRef.current = container
                console.log("container started")

                container.on('server-ready', (port, url) => {
                    console.log("Server ready at", port, url);
                    setIframeUrl(url);
                });

                if (xtermRef.current) {
                    const { term, fitAddon } = xtermRef.current;
                    
                    const shellProcess = await container.spawn('jsh', {
                        terminal: {
                            cols: term.cols,
                            rows: term.rows,
                        }
                    });
                    shellProcessRef.current = shellProcess;

                    shellProcess.output.pipeTo(
                        new WritableStream({
                            write(data) {
                                term.write(data);
                            }
                        })
                    );

                    const input = shellProcess.input.getWriter();
                    term.onData((data) => {
                        input.write(data);
                    });
                }
            })
        }


        receiveMessage('project-message', data => {

            console.log(data)
            
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log(message)

                webContainerRef.current?.mount(message.fileTree)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        })


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

        return () => {
            disconnectSocket();
            if (shellProcessRef.current) {
                shellProcessRef.current.kill();
                shellProcessRef.current = null;
            }
            if (xtermRef.current) {
                xtermRef.current.resizeObserver?.disconnect();
                xtermRef.current.term.dispose();
                xtermRef.current = null;
            }
        }

    }, [])


    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex'>
            <Group orientation="horizontal" className="w-full h-full">
                
                {/* EXPLORER PANEL */}
                <Panel defaultSize={20} minSize={10} className="explorer h-full bg-slate-200 flex flex-col">
                    <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-200 border-b border-slate-300'>
                        <h2 className='text-sm font-semibold uppercase text-slate-500'>Explorer</h2>
                    </header>
                    <div className="file-tree w-full overflow-auto flex-grow">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <div key={index} className="tree-element flex items-center justify-between bg-slate-300 w-full p-2 px-4">
                                    <button
                                        onClick={() => {
                                            setCurrentFile(file)
                                            setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                        }}
                                        className="cursor-pointer flex items-center gap-2">
                                        <p className='font-semibold text-lg'>{file}</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const updatedFileTree = { ...fileTree };
                                            delete updatedFileTree[file];
                                            setFileTree(updatedFileTree);
                                            saveFileTree(updatedFileTree);
                                            if (currentFile === file) setCurrentFile(null);
                                            setOpenFiles(openFiles.filter(f => f !== file));
                                        }}
                                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-400 rounded-md">
                                        <i className="ri-close-fill"></i>
                                    </button>
                                </div>
                            ))

                        }
                    </div>
                </Panel>

                <Separator className="w-1 bg-slate-400 hover:bg-indigo-500 cursor-col-resize transition-colors" />

                {/* EDITOR + BROWSER PANEL */}
                <Panel defaultSize={60} minSize={30} className="flex flex-col h-full bg-slate-50">
                    <Group orientation="vertical" className="w-full h-full">
                        <Panel defaultSize={80} minSize={20} className="flex flex-col h-full">
                            <Group orientation="horizontal" className="w-full h-full">
                                <Panel id="editor-panel" defaultSize={iframeUrl && webContainer ? 50 : 100} minSize={30} className="code-editor flex flex-col h-full bg-slate-50">
                            <div className="top flex justify-between items-center w-full bg-slate-200 border-b border-slate-300">
                                <div className="files flex">
                                    {
                                        openFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className={`open-file flex items-center w-fit bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                                <button
                                                    onClick={() => setCurrentFile(file)}
                                                    className='cursor-pointer p-2 px-4 font-semibold text-lg hover:text-slate-800'>
                                                    {file}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newOpenFiles = openFiles.filter(f => f !== file);
                                                        setOpenFiles(newOpenFiles);
                                                        if (currentFile === file) {
                                                            setCurrentFile(newOpenFiles.length > 0 ? newOpenFiles[0] : null);
                                                        }
                                                    }}
                                                    className="p-1 pr-2 text-slate-500 hover:text-slate-900 rounded-md">
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="actions flex gap-2">
                                    <button
                                        onClick={async () => {
                                            setIsIframeLoading(true)
                                            setRunProcessLogs([]) // clear previous logs
                                            let hasPackageJson = 'package.json' in fileTree;

                                            await webContainer.mount(fileTree)

                                            if (hasPackageJson) {
                                                setRunProcessLogs(prev => [...prev, "Starting npm install...\n"])
                                                const installProcess = await webContainer.spawn("npm", [ "install" ])

                                                installProcess.output.pipeTo(new WritableStream({
                                                    write(chunk) {
                                                        setRunProcessLogs(prev => [...prev, chunk])
                                                        console.log(chunk)
                                                    }
                                                }))

                                                const installExitCode = await installProcess.exit;

                                                if (installExitCode !== 0) {
                                                    setRunProcessLogs(prev => [...prev, "\nnpm install failed. Check logs above.\n"])
                                                    alert("npm install failed. Check the console for details.");
                                                    setIsIframeLoading(false);
                                                    return;
                                                }
                                                setRunProcessLogs(prev => [...prev, "\nnpm install successful. Starting server...\n"])
                                            } else {
                                                setRunProcessLogs(prev => [...prev, "No package.json found. Skipping npm install...\nStarting script...\n"])
                                            }

                                            if (runProcess) {
                                                runProcess.kill()
                                            }

                                            let startCmd = "npm";
                                            let startArgs = ["start"];

                                            if (fileTree['package.json']) {
                                                try {
                                                    const pkg = JSON.parse(fileTree['package.json'].file.contents);
                                                    if (pkg.scripts && pkg.scripts.dev) {
                                                        startCmd = "npm";
                                                        startArgs = ["run", "dev"];
                                                    } else if (pkg.scripts && pkg.scripts.start) {
                                                        startCmd = "npm";
                                                        startArgs = ["start"];
                                                    } else if (pkg.main && fileTree[pkg.main]) {
                                                        startCmd = "node";
                                                        startArgs = [pkg.main];
                                                    } else if (fileTree['server.js']) {
                                                        startCmd = "node";
                                                        startArgs = ["server.js"];
                                                    } else if (fileTree['app.js']) {
                                                        startCmd = "node";
                                                        startArgs = ["app.js"];
                                                    } else if (fileTree['index.js']) {
                                                        startCmd = "node";
                                                        startArgs = ["index.js"];
                                                    }
                                                } catch(err) { console.error(err) }
                                            } else if (fileTree['server.js']) {
                                                startCmd = "node";
                                                startArgs = ["server.js"];
                                            } else if (fileTree['app.js']) {
                                                startCmd = "node";
                                                startArgs = ["app.js"];
                                            } else if (fileTree['index.js']) {
                                                startCmd = "node";
                                                startArgs = ["index.js"];
                                            }

                                            let tempRunProcess = await webContainer.spawn(startCmd, startArgs);

                                            tempRunProcess.output.pipeTo(new WritableStream({
                                                write(chunk) {
                                                    setRunProcessLogs(prev => [...prev, chunk])
                                                    console.log(chunk)
                                                }
                                            }))
                                            
                                            tempRunProcess.exit.then((code) => {
                                                if (code !== 0) {
                                                    setRunProcessLogs(prev => [...prev, `\nServer crashed with exit code ${code}\n`])
                                                    alert("The server crashed! Check your code for errors.");
                                                }
                                                setIsIframeLoading(false);
                                            });

                                            setRunProcess(tempRunProcess)

                                        }}
                                        className='p-2 px-6 m-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-all shadow-md flex items-center gap-2'
                                    >
                                        <i className="ri-play-fill text-lg"></i> {isIframeLoading ? "Starting..." : "Run Code"}
                                    </button>
                                </div>
                            </div>
                            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                                {
                                    fileTree[ currentFile ] && (
                                        <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                            <pre
                                                className="hljs h-full">
                                                <code
                                                    className="hljs h-full outline-none"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const updatedContent = e.target.innerText;
                                                        const ft = {
                                                            ...fileTree,
                                                            [ currentFile ]: {
                                                                file: {
                                                                    contents: updatedContent
                                                                }
                                                            }
                                                        }
                                                        setFileTree(ft)
                                                        saveFileTree(ft)
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                        paddingBottom: '25rem',
                                                        counterSet: 'line-numbering',
                                                    }}
                                                />
                                            </pre>
                                        </div>
                                    )
                                }
                            </div>
                        </Panel>

                        {iframeUrl && webContainer &&
                            (<>
                                <Separator className="w-1 bg-slate-400 hover:bg-indigo-500 cursor-col-resize transition-colors" />
                                <Panel id="browser-panel" defaultSize={50} minSize={20} className="flex flex-col h-full">
                                    <div className="address-bar">
                                        <input type="text"
                                            onChange={(e) => setIframeUrl(e.target.value)}
                                            value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
                                    </div>
                                    <iframe src={iframeUrl} className="w-full h-full"></iframe>
                                </Panel>
                            </>)
                        }
                            </Group>
                        </Panel>

                        <Separator className="h-1 bg-slate-400 hover:bg-indigo-500 cursor-row-resize transition-colors" />
                        
                        <Panel defaultSize={20} minSize={10} className="flex flex-col bg-slate-900 text-slate-100 overflow-auto p-2">
                            <div className="flex gap-6 border-b border-slate-700 pb-2 mb-2 text-xs font-semibold text-slate-400 mt-1">
                                <h3 className="cursor-pointer hover:text-slate-100">PROBLEMS</h3>
                                <h3 className="cursor-pointer hover:text-slate-100">OUTPUT</h3>
                                <h3 className="cursor-pointer hover:text-slate-100">DEBUG CONSOLE</h3>
                                <h3 className="cursor-pointer text-slate-100 border-b-2 border-indigo-500 pb-2 -mb-2">TERMINAL</h3>
                                <h3 className="cursor-pointer hover:text-slate-100">PORTS</h3>
                            </div>
                            <div 
                                className="flex-grow overflow-hidden h-full"
                                ref={terminalRef}
                            >
                            </div>
                        </Panel>

                    </Group>
                </Panel>

                <Separator className="w-1 bg-slate-400 hover:bg-indigo-500 cursor-col-resize transition-colors" />

                {/* CHAT PANEL */}
                <Panel defaultSize={20} minSize={15} className="relative flex flex-col h-full bg-slate-300">
                    <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0'>
                        <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                            <i className="ri-add-fill mr-1"></i>
                            <p>Add collaborator</p>
                        </button>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                            <i className="ri-group-fill"></i>
                        </button>
                    </header>
                    <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">

                        <div
                            ref={messageBox}
                            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                            {messages.map((msg, index) => (
                                <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                    <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                    <div className='text-sm'>
                                        {msg.sender._id === 'ai' ?
                                            WriteAiMessage(msg.message)
                                            : <p>{msg.message}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="inputField w-full flex absolute bottom-0">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        send()
                                    }
                                }}
                                className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
                            <button
                                onClick={send}
                                className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                        </div>
                    </div>
                    <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'} top-0 z-20`}>
                        <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>
                            <div className='flex items-center gap-4 w-full'>
                                <h1 className='font-semibold text-lg flex-1'>Collaborators</h1>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className='text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1'
                                >
                                    <i className="ri-add-line"></i> Invite
                                </button>
                                <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 ml-2 hover:bg-slate-300 rounded-md transition-colors'>
                                    <i className="ri-close-fill"></i>
                                </button>
                            </div>
                        </header>
                        <div className="users flex flex-col">
                            {project.collaborators && project.collaborators.map((collaborator, index) => {
                                const collabUser = collaborator.user;
                                if (!collabUser) return null;
                                
                                const isMe = collabUser._id === user._id;
                                const isOwner = collaborator.role === 'Owner';
                                const myRole = project.collaborators.find(c => c.user._id === user._id)?.role || project.collaborators.find(c => c.user === user._id)?.role;
                                const amIOwner = myRole === 'Owner';
                                
                                return (
                                    <React.Fragment key={collabUser._id}>
                                        <div className="user hover:bg-slate-100 p-4 flex justify-between items-center transition-colors group relative">
                                            <div className="flex gap-3 items-center">
                                                <div className="relative">
                                                    <div className='w-10 h-10 rounded-full flex items-center justify-center text-white bg-slate-600 shadow-sm'>
                                                        <i className="ri-user-fill"></i>
                                                    </div>
                                                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isMe ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <h1 className='font-semibold text-slate-900 leading-tight'>
                                                        {collabUser.fullName || collabUser.email} {isMe && '(You)'}
                                                    </h1>
                                                    <p className='text-xs text-slate-500 font-medium mt-0.5'>{collaborator.role}</p>
                                                </div>
                                            </div>
                                            
                                            {amIOwner && !isMe && (
                                                <div className="relative group/menu">
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors">
                                                        <i className="ri-more-2-fill"></i>
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-1 hidden group-hover/menu:block z-50">
                                                        <button 
                                                            onClick={async () => {
                                                                if(confirm(`Remove ${collabUser.fullName || collabUser.email} from the project?`)) {
                                                                    try {
                                                                        const res = await axios.put('/projects/remove-user', {
                                                                            projectId: project._id,
                                                                            userId: collabUser._id
                                                                        });
                                                                        setProject(res.data.project);
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <i className="ri-user-unfollow-line"></i> Remove from project
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {index < project.collaborators.length - 1 && (
                                            <div className="h-px bg-slate-200 mx-4"></div>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </Panel>
            </Group>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.filter(u => !project.collaborators?.some(c => c.user?._id === u._id)).map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.fullName || user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project