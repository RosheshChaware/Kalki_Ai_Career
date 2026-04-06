import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, LogOut, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navbar = ({ onStartAssessment, onOpenSignIn, onOpenSignUp, onOpenExplorer, onOpenCareerOutcomes, onOpenLearningPage, onOpenScholarships }) => {
  const { t, i18n } = useTranslation();
  const { user, logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  // Get initials from display name
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  // Scroll listener — glassmorphism effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('navbar.subjectAdvisor'), onClick: () => { onStartAssessment(); setMobileOpen(false); }, icon: '🧠' },
    { label: t('navbar.collegeExplorer'), onClick: () => { if(onOpenExplorer) onOpenExplorer(); setMobileOpen(false); }, icon: '🏫' },
    { label: t('navbar.careerOutcomes'), onClick: () => { if(onOpenCareerOutcomes) onOpenCareerOutcomes(); setMobileOpen(false); }, icon: '📊' },
    { label: t('navbar.personalizedProfile'), onClick: () => { if(onOpenLearningPage) onOpenLearningPage(); setMobileOpen(false); }, icon: '🎯' },
    { label: t('navbar.scholarships'), onClick: () => { if(onOpenScholarships) onOpenScholarships(); setMobileOpen(false); }, icon: '🎓' },
  ];

  // Mobile drawer animation variants
  const drawerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1], staggerChildren: 0.06, delayChildren: 0.1 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.25, ease: [0.25, 0.8, 0.25, 1] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
          backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.72)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.12)' : '1px solid rgba(255,255,255,0.03)',
          transition: 'background-color 0.4s ease, border-bottom 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Top glowing line accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: scrolled
              ? 'linear-gradient(90deg, transparent 0%, #6366f1 20%, #a78bfa 50%, #6366f1 80%, transparent 100%)'
              : 'transparent',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Desktop row */}
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 py-3.5">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              {/* Glow pulse */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-purple-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                EduVeda
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-primary/70 -mt-0.5">
                AI Powered
              </span>
            </div>
          </motion.div>

          {/* Desktop links — pill-style with hover highlights */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1 border border-white/[0.04]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setActiveLink(link.label);
                  link.onClick();
                }}
                onMouseEnter={() => setActiveLink(link.label)}
                onMouseLeave={() => setActiveLink(null)}
                className="relative px-4 py-2 text-[13px] font-medium text-white/80 hover:text-white transition-colors duration-200 rounded-xl"
              >
                {/* Active / Hover background */}
                {activeLink === link.label && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 rounded-xl bg-white/[0.07] border border-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-[13px] font-medium px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 mr-2"
            >
              {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            {user ? (
              /* ── Logged-in user menu ── */
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl border border-white/10 hover:border-primary/30 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
                    {initials}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate text-white/80">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2.5 w-56 rounded-2xl border border-white/10 bg-[#0c0c0f]/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3.5 border-b border-white/5">
                        <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-1">{t('navbar.signedInAs')}</p>
                        <p className="text-sm font-medium truncate text-white/90">{user.email}</p>
                        {user.emailVerified && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase font-bold text-emerald-400 tracking-wide">
                            <CheckCircle2 className="w-3 h-3" /> {t('navbar.verified')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => { logOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('navbar.signOut')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Logged-out buttons ── */
              <div className="flex items-center gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenSignIn}
                  className="text-[13px] font-medium px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                >
                  {t('navbar.signIn')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenSignUp}
                  className="relative text-[13px] font-semibold px-5 py-2.5 rounded-xl text-white overflow-hidden group"
                >
                  {/* Gradient BG */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] group-hover:animate-[shimmer_2s_ease-in-out_infinite] transition-all duration-300" />
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('navbar.getStarted')}
                  </span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="lg:hidden p-2.5 rounded-xl border border-white/10 hover:border-primary/30 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5 text-white/80" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5 text-white/80" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden border-t border-white/5 bg-[#080810]/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.label}
                    variants={itemVariants}
                    onClick={link.onClick}
                    className="flex items-center gap-3 text-left text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </motion.button>
                ))}

                <motion.button
                  variants={itemVariants}
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 text-left text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl mt-2"
                >
                  <span className="text-lg">🌐</span>
                  {i18n.language === 'en' ? 'हिन्दी में बदलें' : 'Change to EN'}
                </motion.button>

                <motion.div variants={itemVariants} className="mt-3 pt-4 border-t border-white/5 flex flex-col gap-3">
                  {user ? (
                    <>
                      <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shadow-inner">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate text-white/90">{user.displayName || 'User'}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                          </div>
                        </div>
                        {user.emailVerified && (
                          <div className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> {t('navbar.verified')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => { logOut(); setMobileOpen(false); }}
                        className="flex items-center justify-center gap-2 text-sm font-medium text-red-400 border border-red-500/15 hover:bg-red-500/10 py-3 rounded-xl transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('navbar.signOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { onOpenSignIn(); setMobileOpen(false); }}
                        className="text-sm font-medium px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 w-full"
                      >
                        {t('navbar.signIn')}
                      </button>
                      <button
                        onClick={() => { onOpenSignUp(); setMobileOpen(false); }}
                        className="relative text-sm font-semibold px-4 py-3 rounded-xl text-white overflow-hidden w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {t('navbar.getStarted')}
                        </span>
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to offset fixed navbar */}
      <div className="h-[60px]" />

      {/* Backdrop to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-[99]" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
