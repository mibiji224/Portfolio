⚡ Personal Portfolio
<!--  -->A high-performance, responsive, and aesthetically pleasing personal portfolio website built with React (Vite) and Tailwind CSS.It features a glassmorphism UI, a fully functional contact form powered by serverless functions, and a seamless mobile-first design.🚀 Features⚡ Blazing Fast: Built with Vite for instant server start and hot module replacement.🎨 Modern UI: Sleek dark mode design with glassmorphism effects and Tailwind CSS styling.📱 Fully Responsive: Optimized for all devices, from large desktops to mobile phones.📧 Functional Contact Form: Serverless API endpoint included to receive emails directly from your site.✨ Smooth Animations: Subtle interactions and hover states for a polished feel.🧩 Modular Code: Clean component structure using functional React components.🛠️ Tech StackFrontend: React, ViteStyling: Tailwind CSSIcons: Lucide ReactBackend (API): Vercel Serverless Functions (Node.js)Deployment: Vercel📂 Project Structure├── api/                # Serverless functions (backend for email)
│   └── send-email.js   # The logic to send emails using Nodemailer
├── public/             # Static assets (Favicon, images)
├── src/
│   ├── components/     # Reusable UI components
│   ├── App.jsx         # Main application logic
│   ├── index.css       # Tailwind directives and global styles
│   └── main.jsx        # Entry point
├── .env                # Environment variables (do not commit this)
└── package.json        # Dependencies
