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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
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

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Recruiterflow Take-Home Assignment — Full Stack Developer Intern Submission</p>
          <p className="font-medium text-slate-600">Built with React, Redux Toolkit, Node.js, Raw SQLite &amp; Playwright</p>
        </div>
      </footer>
    </div>
  );
};
