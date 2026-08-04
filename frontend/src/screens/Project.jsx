import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage, disconnectSocket } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'
import { Panel, Group, Separator } from 'react-resizable-panels'

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

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
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

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                webContainerRef.current = container
                console.log("container started")
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
                                            <button
                                                key={index}
                                                onClick={() => setCurrentFile(file)}
                                                className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                                <p
                                                    className='font-semibold text-lg'
                                                >{file}</p>
                                            </button>
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
                                                        startArgs = ["run", "dev"];
                                                    } else if (pkg.scripts && pkg.scripts.start) {
                                                        startArgs = ["start"];
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

                                            webContainer.on('server-ready', (port, url) => {
                                                console.log(port, url)
                                                setRunProcessLogs(prev => [...prev, `\nServer is ready and running at ${url}\n`])
                                                setIframeUrl(url)
                                                setIsIframeLoading(false)
                                            })

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
                            <div className="font-mono text-xs flex-grow overflow-auto">
                                {runProcessLogs.map((log, i) => (
                                    <span key={i} className="block whitespace-pre-wrap">{log}</span>
                                ))}
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

                            <h1
                                className='font-semibold text-lg'
                            >Collaborators</h1>

                            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users flex flex-col gap-2">

                            {project.users && project.users.map(user => {


                                return (
                                    <div key={user._id} className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                                        <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                            <i className="ri-user-fill absolute"></i>
                                        </div>
                                        <h1 className='font-semibold text-lg'>{user.email}</h1>
                                    </div>
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
                            {users.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
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