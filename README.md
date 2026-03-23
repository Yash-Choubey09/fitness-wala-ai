# FITNESS WALA AI

A production-ready full stack web application for an AI-powered fitness platform with stunning animations, interactive components, and a futuristic aesthetic. Built with React (Vite), Node.js (Express), MongoDB, TailwindCSS, Framer Motion, and Three.js.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Three.js, React Router
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth
- **UI/UX**: Custom Glassmorphism, Neon Highlights, Dark Mode UI

## Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Step 1: Clone the Repository
Ensure you are in the project root directory (`c:\Users\LENOVO\Desktop\AGAutonomous AI Based Fitness Coach - Project`).

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Environment Variables:
   Open `backend/.env` and ensure the `MONGODB_URI` aligns with your DB. For AI logic to work properly, you should add your `AI_API_KEY` (e.g., Google Gemini) if you switch out the mocked responses.
   
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Step 4: Access the Application
- The frontend will run on `http://localhost:5173`
- The backend API runs on `http://localhost:5000`

---
*Created by Antigravity (Advanced Agentic AI).*
