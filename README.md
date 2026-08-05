# CollabCode 🚀

A highly advanced, browser-based collaborative Integrated Development Environment (IDE) that seamlessly combines real-time team collaboration with an autonomous AI pair programmer and an in-browser operating system.

![CollabCode Preview](https://via.placeholder.com/1000x500.png?text=CollabCode+Workspace)

CollabCode allows development teams to chat, write code, interact with a fully-contextual AI assistant, and execute backend servers directly within their browser without requiring any cloud VMs.

## ✨ Core Features

- **Real-Time Collaboration**: Built with Socket.io, multiple users can join a project workspace, chat in real-time, and coordinate development efforts effortlessly.
- **Agentic AI Pair Programmer**: Integrated with Groq's high-speed Llama 3 model. The AI is fully aware of your entire project file tree. Simply mention `@ai` in the chat, and the AI can generate, update, and manage code files directly in your workspace.
- **In-Browser OS (WebContainers)**: Run a native Node.js runtime entirely in the browser! No server provisioning required. Start an Express server or build a React app right from the client.
- **Interactive Terminal (Xterm.js)**: A fully functional bash terminal integrated directly into the UI. Run commands like `npm install`, start scripts, and view live process logs.
- **Dynamic IDE Interface**: Powered by `react-resizable-panels`, the workspace includes a file explorer, syntax-highlighted code editor, terminal, chat panel, and a live web preview iframe.
- **Secure Authentication & Management**: Complete JWT-based authentication system for managing users, project workspaces, and role-based access control for collaborators.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Socket.io Client, WebContainer API, Xterm.js, Highlight.js
- **Backend**: Node.js, Express.js, Socket.io, MongoDB, Mongoose
- **AI Integration**: Groq SDK (Llama-3.3-70b-versatile)
- **Security**: JSON Web Tokens (JWT), bcrypt

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Groq API Key

### 1. Clone the repository
```bash
git clone https://github.com/Anjal08/CollabCode.git
cd CollabCode
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```
Start the frontend server:
```bash
npm run dev
```

## 💡 Usage Guide

1. **Create a Workspace**: Sign in and create a new project.
2. **Invite the Team**: Add other registered developers as collaborators to your project.
3. **Summon the AI**: Open the chat panel and type `@ai create an express server on port 3000`. Watch as the file tree automatically populates!
4. **Run Code**: Open the Terminal tab, type `npm install` and then `node index.js`. Your code is now running in the browser sandbox.

## 📄 License
This project is licensed under the MIT License.
