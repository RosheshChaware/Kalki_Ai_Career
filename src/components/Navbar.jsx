import React, { useState } from 'react';
import { GraduationCap, Menu, X, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onStartAssessment, onOpenSignIn, onOpenSignUp, onOpenExplorer, onOpenCareerOutcomes, onOpenLearningPage }) => {
  const { user, logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get initials from display name
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const navLinks = [
    { label: 'Subject Advisor', onClick: () => { onStartAssessment(); setMobileOpen(false); } },
    { label: 'College Explorer', onClick: () => { if(onOpenExplorer) onOpenExplorer(); setMobileOpen(false); } },
    { label: 'Career Outcomes', onClick: () => { if(onOpenCareerOutcomes) onOpenCareerOutcomes(); setMobileOpen(false); } },
    { label: 'Personalized Profile', onClick: () => { if(onOpenLearningPage) onOpenLearningPage(); setMobileOpen(false); } },
    { label: 'Scholarships', onClick: null },
  ];

  return (
    <nav className="relative border-b border-white/5 bg-background">
      {/* Desktop row */}
      <div className="flex items-center justify-between px-8 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <GraduationCap className="text-primary w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight">CareerPath</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-textMuted">
          {navLinks.map((link) =>
            link.onClick ? (
              <button key={link.label} onClick={link.onClick} className="hover:text-textMain transition-colors">
                {link.label}
              </button>
            ) : (
              <a key={link.label} href="#" onClick={(e) => e.preventDefault()} className="hover:text-textMain transition-colors">
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            /* ── Logged-in user menu ── */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                  {initials}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
                <ChevronDown className={`w-4 h-4 text-textMuted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 py-1">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-textMuted">Signed in as</p>
                    <p className="text-sm font-medium truncate mb-1">{user.email}</p>
                    {user.emailVerified && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[10px] uppercase font-bold text-green-400">
                        Email Verified <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { logOut(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged-out buttons ── */
            <>
              <button
                onClick={onOpenSignIn}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenSignUp}
                className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-surface/95 backdrop-blur-lg px-8 py-6 flex flex-col gap-5">
          {navLinks.map((link) =>
            link.onClick ? (
              <button key={link.label} onClick={link.onClick} className="text-left text-textMuted hover:text-white transition-colors text-sm font-medium">
                {link.label}
              </button>
            ) : (
              <a key={link.label} href="#" onClick={(e) => e.preventDefault()} className="text-textMuted hover:text-white transition-colors text-sm font-medium">
                {link.label}
              </a>
            )
          )}

          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-textMuted truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.emailVerified && (
                    <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400">
                      Email Verified <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { logOut(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 py-2.5 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onOpenSignIn(); setMobileOpen(false); }}
                  className="text-sm font-medium px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors w-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenSignUp(); setMobileOpen(false); }}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors w-full"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
