import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Receipt, 
  PlusCircle, 
  Bot, 
  Database, 
  CheckCircle2, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                Trip Splitter <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Goa</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">Full Stack Suite</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink to="/" end className={navLinkClasses}>
              <Receipt className="w-4 h-4" />
              <span>Expenses</span>
            </NavLink>

            <NavLink to="/expenses/new" className={navLinkClasses}>
              <PlusCircle className="w-4 h-4" />
              <span>Add expense</span>
            </NavLink>

            <div className="h-5 w-px bg-slate-200 mx-2" aria-hidden="true" />

            <NavLink to="/recruiter-bot" className={navLinkClasses} title="Section B: RecruiterBot Matching">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>RecruiterBot</span>
            </NavLink>

            <NavLink to="/sql-detective" className={navLinkClasses} title="Section B: SQL Detective Challenge">
              <Database className="w-4 h-4 text-blue-600" />
              <span>SQL Detective</span>
            </NavLink>

            <NavLink to="/qa-suite" className={navLinkClasses} title="Section A: Playwright QA Tests">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>QA Suite</span>
            </NavLink>
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            <Receipt className="w-4 h-4" />
            <span>Expenses</span>
          </NavLink>

          <NavLink
            to="/expenses/new"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add expense</span>
          </NavLink>

          <div className="h-px bg-slate-200 my-2" />

          <NavLink
            to="/recruiter-bot"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>RecruiterBot (Section B)</span>
          </NavLink>

          <NavLink
            to="/sql-detective"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>SQL Detective (Section B)</span>
          </NavLink>

          <NavLink
            to="/qa-suite"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>QA Suite (Section A)</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
