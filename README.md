# Real-Time Collaborative Chat & AI Code Workspace

A full-stack collaborative application that combines real-time team chat with an integrated AI-powered code editor. It allows teams to communicate seamlessly, add collaborators to projects, generate code using AI, and run applications directly in the browser—all in a synchronized, real-time workspace.

## Features

- **Real-Time Team Collaboration**: Built with Socket.io to allow multiple users to chat, collaborate on projects, and share messages instantly in a synchronized workspace.
- **Add Collaborators**: Easily invite team members to join your project workspace for shared development and communication.
- **AI Code Generation**: Integrated with Groq AI to act as an automated team member that can generate code, scripts, and complete file structures when prompted with `@ai` in the chat.
- **In-Browser Execution**: Runs Node.js and React applications directly in the browser using the WebContainer API.
- **VS Code-like Interface**: Features a resizable Explorer panel, an interactive Code Editor (with syntax highlighting), and a functional Terminal for viewing output and logs.
- **Secure Backend**: Express.js server backed by MongoDB for securely storing projects, users, and team conversations.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.io Client
- WebContainer API
- Highlight.js (Syntax Highlighting)
- React Resizable Panels

### Backend
- Node.js & Express
- Socket.io
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Groq SDK (AI Integration)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Groq API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
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

3. Setup Frontend:
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

## Usage

1. Open the frontend URL in your browser.
2. Create or open a project.
3. Use the Chat panel on the right to prompt the AI (e.g., `@ai Create an express server`).
4. The AI will generate the files and populate the Explorer.
5. Click **Run Code** to execute the project inside the browser terminal!

## License

This project is licensed under the MIT License.
