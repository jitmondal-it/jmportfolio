# Jit Mondal — Developer Portfolio

A clean, personal developer portfolio website built with React, Vite, and Tailwind CSS to showcase my projects, technical skills, and experience as a Java backend developer and full-stack engineer.

The site also features an integrated AI assistant powered by Google Gemini that answers visitor questions about my technical background, projects, and architecture decisions using verified portfolio context.

**Live Demo:** [j-m-portfolio-tau.vercel.app](https://j-m-portfolio-tau.vercel.app/)

---

## Features

- **Project Showcase**: Detailed cards and dedicated project pages highlighting full-stack and backend applications (such as HireSphere and Synapse), including architecture overviews, live demos, and source code links.
- **AI Chatbot**: An interactive portfolio assistant powered by Google Gemini. It uses a server-side retriever to answer questions based strictly on verified portfolio data, preventing hallucinations and safely validating external links.
- **Categorized Skills**: A clear breakdown of technical skills across backend engineering, cloud & distributed systems, databases, and frontend development.
- **Theme Toggle**: Light and dark mode support with preference saved to local storage.
- **Responsive & Accessible**: Mobile-first design that adapts cleanly to phones, tablets, and desktops, with reduced-motion support for animations.
- **Direct Contact**: Quick email copy button, direct mail links, and links to GitHub, LinkedIn, and LeetCode.

---

## Tech Stack

### Frontend
- **React 19** — Component-based UI library
- **Vite** — Fast local development and build tooling
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Smooth animations and layout transitions
- **React Router v7** — Client-side navigation (`/`, `/projects`, `/about`)
- **React Icons** — Interface iconography

### Backend & AI
- **Node.js Serverless Function (`api/chat.js`)** — Handles chat requests for Vercel and local development
- **Google Gemini API** — Generates conversational responses for the portfolio assistant
- **Context Retriever (`portfolioRetriever.js`)** — Grounds AI responses in verified portfolio data

### Deployment & Tooling
- **Vercel** — Static site hosting and serverless functions
- **ESLint** — Code quality and linting

---

## Getting Started

Follow these steps to run the portfolio locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (included with Node.js)
- A Google Gemini API key (optional for browsing the site, required for live AI chatbot responses)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jitmondal-it/J-M-Portfolio.git
   cd J-M-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`. 
   
   *Note:* The Vite development configuration (`vite.config.js`) includes a local middleware that serves `/api/chat`, so the AI chatbot works right out of the box in local development without needing a separate backend server.

### Build and Preview

- **Build for production:**
  ```bash
  npm run build
  ```
- **Preview the production build locally:**
  ```bash
  npm run preview
  ```
- **Run linter:**
  ```bash
  npm run lint
  ```

---

## AI Chatbot Setup

The portfolio includes an AI assistant that answers visitor questions about my experience, skills, and projects. It runs through a serverless backend to keep API credentials secure.

### Getting an API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and generate a new key.

### Local Configuration

Add the key to your `.env` file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

You can optionally choose a specific model (defaults to `gemini-3.6-flash`):

```env
GEMINI_MODEL=gemini-3.6-flash
```

> **Security Note:** Never commit your `.env` file to version control. The repository's `.gitignore` already excludes `.env` files. The API key is only accessed on the server side (`api/chat.js`) and is never exposed to the browser client.

If no API key is provided, the chatbot interface will still open and display a friendly message explaining how to configure the key.

---

## Project Structure

Here is a quick map of the project layout:

```text
J-M-Portfolio/
├── api/
│   └── chat.js                 # Serverless API endpoint handling Gemini chat requests
├── public/                     # Static assets (images, project screenshots, resume PDF)
├── src/
│   ├── assets/                 # Styling assets and icons
│   ├── components/             # Reusable UI components (Hero, AIChatBot, ProjectCard, etc.)
│   ├── content/
│   │   └── site.js             # Single source of truth for portfolio data, projects, and bio
│   ├── hooks/                  # Custom React hooks (e.g. usePrefersReducedMotion)
│   ├── pages/                  # Route components (Home, ProjectsPage, AboutPage)
│   ├── utils/
│   │   └── portfolioRetriever.js # Context retriever & URL verifier for the AI bot
│   ├── App.jsx                 # Main layout, theme state, and route configuration
│   ├── index.css               # Global styles, variables, and typography
│   └── main.jsx                # Application root entry
├── .env.example                # Example environment variable file
├── index.html                  # HTML entry point with meta tags and font links
├── package.json                # Project dependencies and scripts
└── vite.config.js              # Vite configuration with dev API middleware
```

---

## Deployment

This portfolio is configured for deployment on **[Vercel](https://vercel.com/)**:

1. Push your code to your GitHub repository.
2. Log in to Vercel and import the repository.
3. Vercel automatically detects the Vite setup:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add your environment variable in Vercel:
   - Go to **Project Settings** > **Environment Variables**.
   - Add `GEMINI_API_KEY` with your secret key value.
   - *(Optional)* Add `GEMINI_MODEL` if you want to use a specific model.
5. Click **Deploy**. Vercel will build the frontend assets and deploy `api/chat.js` as a serverless function reachable at `/api/chat`.

---

## Contact

If you'd like to get in touch, discuss a project, or talk about engineering opportunities, reach out through any of the channels below:

- **Email**: [jitmondal631@gmail.com](mailto:jitmondal631@gmail.com)
- **GitHub**: [github.com/jitmondal-it](https://github.com/jitmondal-it)
- **LinkedIn**: [linkedin.com/in/jit-mondal-dev](https://www.linkedin.com/in/jit-mondal-dev/)
- **LeetCode**: [leetcode.com/u/Jit_Mondal2411](https://leetcode.com/u/Jit_Mondal2411/)
