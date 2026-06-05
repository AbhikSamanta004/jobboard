import React from 'react';
import { Shield, Sparkles, Zap, Smartphone, Layers, Terminal } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      title: 'JWT Authentication',
      desc: 'Security standard using signed JSON Web Tokens, bcrypt hashing, and context session validation.',
      icon: <Shield className="w-6 h-6 text-primary-400" />,
    },
    {
      title: 'Glassmorphism UI',
      desc: 'Vibrant violet-accented dashboard cards, smooth transitions, skeleton loaders, and a mobile drawer.',
      icon: <Sparkles className="w-6 h-6 text-violet-400" />,
    },
    {
      title: 'Serverless Readiness',
      desc: 'Optimized for monorepo deployments on Vercel utilizing Node.js Express serverless functions.',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Mobile-First Layouts',
      desc: 'Fully responsive sidebar grids and flex wrappers that adapt smoothly across iOS, Android, and web.',
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">About JobX</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A production-ready recruiter portal and candidate matchmaking board built with modern architecture.
          </p>
        </div>

        {/* Content Section */}
        <div className="glass-card p-8 md:p-10 mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-400" />
            <span>Project Architecture Overview</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            JobX utilizes a modular, full-stack Javascript architecture. The backend is powered by Node.js, Express.js, and MongoDB, connecting via Mongoose. The frontend is built on Vite, React, and Tailwind CSS.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            By shifting file storage directly to MongoDB as Base64 encoded blobs, the application remains fully stateless. This allows deployment onto serverless infrastructure (like Vercel serverless functions) without requiring any cloud storage (S3/Cloudinary) configuration, making it robust and easy to instantiate.
          </p>
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Engineered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {highlights.map((h, i) => (
            <div key={i} className="glass-card p-6 flex gap-4 items-start hover:border-slate-700 transition-colors">
              <div className="p-3 bg-slate-800 rounded-xl flex-shrink-0">{h.icon}</div>
              <div>
                <h3 className="font-bold text-white text-base mb-1.5">{h.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Listing */}
        <div className="glass-card p-8 md:p-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary-400" />
            <span>Tech Stack & Packages</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white mb-2">Frontend</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>React.js (Vite)</li>
                <li>Tailwind CSS</li>
                <li>React Router DOM</li>
                <li>Lucide Icons</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Backend</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Node.js + Express</li>
                <li>Mongoose</li>
                <li>JWT Token auth</li>
                <li>Bcrypt password hashing</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">CI/CD & Deployment</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>GitHub Actions</li>
                <li>Vercel Deploy config</li>
                <li>Workspace Monorepo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
