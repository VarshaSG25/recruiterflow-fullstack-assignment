import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.js';
import { ExpensesPage } from './pages/ExpensesPage.js';
import { AddExpensePage } from './pages/AddExpensePage.js';
import { RecruiterBotPage } from './pages/RecruiterBotPage.js';
import { SqlDetectivePage } from './pages/SqlDetectivePage.js';
import { QaSuitePage } from './pages/QaSuitePage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Aesthetic Ambient Glowing Lighting & Mesh Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-purple-500/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-40" />
      </div>

      {/* Main App Content on top of aesthetic background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Section C: Trip Splitter Core Routes */}
            <Route path="/" element={<ExpensesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/new" element={<AddExpensePage />} />

            {/* Section B & Section A Showcase Routes */}
            <Route path="/recruiter-bot" element={<RecruiterBotPage />} />
            <Route path="/sql-detective" element={<SqlDetectivePage />} />
            <Route path="/qa-suite" element={<QaSuitePage />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 mt-16 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-slate-600">
              © 2026 Recruiterflow Take-Home Assignment — Full Stack Developer Intern Submission
            </p>
            <p className="text-slate-500">
              Trip Splitter • RecruiterBot • SQL Detective • Playwright QA
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
