# 🚀 AI-Powered Real-Time Collaborative Code Editor

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?style=for-the-badge&logo=socket.io)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=for-the-badge&logo=redis)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-orange?style=for-the-badge)
![WebContainers](https://img.shields.io/badge/WebContainers-In--Browser_Execution-purple?style=for-the-badge)

An advanced, real-time collaborative workspace that combines chat, file management, and an integrated AI assistant (powered by Google Gemini) into a single seamless environment. Built with a robust MERN stack architecture, it leverages WebContainers to execute code directly in the browser and Redis for high-performance session management.

---

## ✨ Key Features

- **🤖 Integrated AI Assistant (Gemini 1.5):** Tag `@ai` in the chat to instantly generate code, debug errors, or ask technical questions. The AI intelligently generates complete file structures that can be mounted into the editor.
- **⚡ Real-Time Collaboration:** Powered by `Socket.io`, multiple users can join a project workspace and chat instantly without page reloads.
- **💻 In-Browser Code Execution:** Uses WebContainers to spin up an actual Node.js environment directly inside the browser, allowing you to run `npm install` and `npm start` without relying on a remote server.
- **🔒 Secure Authentication:** JWT-based authentication with password hashing (Bcrypt) and secure token storage.
- **🚀 High-Performance Caching:** Integrates **Redis** to cache user sessions and API tokens, drastically reducing MongoDB database queries and improving response times.
- **📂 Dynamic File Tree & Editor:** A fully functional file tree Explorer and code editor with syntax highlighting (Highlight.js).

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Vite) - UI library
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **WebContainers API** - In-browser Node.js execution
- **Highlight.js** - Syntax highlighting
- **Markdown-to-JSX** - Rendering AI markdown responses

### **Backend**
- **Node.js & Express.js** - REST API & Server
- **Socket.io** - WebSocket connections for real-time chat
- **MongoDB & Mongoose** - Primary database
- **Redis (ioredis)** - In-memory caching layer
- **Google Generative AI SDK** - Gemini AI integration
- **JSON Web Tokens (JWT)** - Authentication

---

## 🏗️ Architecture & Flow

1. **User Auth:** Users log in, receiving a JWT token. This token is verified against Redis for instant authorization.
2. **Project Rooms:** Users create or join "Projects". Upon entering a project, they connect to a specific Socket.io room.
3. **AI Generation:** When a message contains `@ai`, the backend intercepts it and forwards the prompt to Google's Gemini API. The AI responds with structured JSON containing text and a `fileTree`.
4. **Mount & Run:** The frontend receives the AI's file tree, mounts it into a WebContainer, and allows the user to view, edit, and run the generated code in a secure browser sandbox.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/), and a [Redis](https://redis.io/) instance running. You will also need a free [Google AI Studio](https://aistudio.google.com/) API key.

### 1. Clone the repository
```bash
git clone https://github.com/Anjal08/AI-Code-Editor.git
cd AI-Code-Editor
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_KEY=your_google_gemini_api_key
```
Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🛡️ Security Highlights
- Passwords are never stored in plaintext (Bcrypt).
- API requests are guarded by JWT authorization middleware.
- Redis caching prevents database overload.
- Sensitive environment variables are excluded from version control via `.gitignore`.

---

## 🔮 Future Improvements
- [ ] Add Docker support for easier local deployment.
- [ ] Implement video/audio calls for project collaborators.
- [ ] Add support for Python and other languages in WebContainers.
- [ ] Deploy backend to Render and Frontend to Vercel.

---
*Built with ❤️ for developers.*
