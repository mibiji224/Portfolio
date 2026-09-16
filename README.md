<!-- Back to Top Link -->

<a name="readme-top"></a>

<div align="center">

<!-- PROJECT LOGO -->

<br />
<!-- Uncomment the below line after adding your preview.png to the public folder -->
<!-- <img src="public/preview.png" alt="Project Screenshot" width="700" height="auto" /> -->

<br />

<h1>⚡ Personal Portfolio</h1>

<p align="center">
A high-performance, glassmorphism-styled personal portfolio.

Fully responsive, mobile-first, and deployed on Vercel.
<br />
<br />
<a href="https://desireesoronio.vercel.app"><strong>View Live »</strong></a>

</p>
</div>

<br />

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3 |
| Animation | GSAP 3 |
| Icons | Lucide React |
| Database / Auth | Supabase |
| Email | Resend |
| Linting | ESLint 9 |
| Hosting | Vercel |
| Language | JavaScript (ES Modules) |

<br />

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your Supabase and Resend keys
npm run dev            # http://localhost:5173
```

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

<br />

## Project Structure

```
.
├── api/          Vercel serverless functions (contact form via Resend)
├── public/       Static assets: images, certificates, project screenshots
├── src/
│   ├── admin/      Admin dashboard
│   ├── components/ Shared UI components
│   ├── context/    React context providers (auth)
│   ├── hooks/      Custom hooks (lazy loading, portfolio data)
│   ├── lib/        Supabase client
│   └── pages/      Route-level pages
└── supabase/     Database schema and seed SQL
```

<br />

## Sections

- **Home**: Hero section with animated introduction
- **Experience**: Work history and roles
- **Projects**: Showcase of personal and professional projects
- **Contact**: Email contact form powered by Resend
- **Footer**: Links and closing info

<br />

## ✨ Features

This portfolio is built with modern web standards to ensure speed, accessibility, and ease of use.

⚡ **Blazing Fast**: Powered by Vite with lazy-loaded sections for optimal performance.

🎨 **Modern Design**: Dark mode, glassmorphism UI, and smooth GSAP animations.

📱 **Fully Responsive**: Flawless layout on mobile, tablet, and desktop devices.

📧 **Contact Ready**: Integrated email sending via Resend API.

🧩 **Modular Architecture**: Clean, component-based structure using React lazy + Suspense.

