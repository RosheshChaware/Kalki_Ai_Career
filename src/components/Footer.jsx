import React from "react";
import { useTranslation } from "react-i18next";

// Icons as inline SVG for zero-dependency usage
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M13 2L4.09 12.96A1 1 0 0 0 5 14.5h5.5L11 22l8.91-10.96A1 1 0 0 0 19 9.5H13.5L13 2z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path fill="#0d0d18" d="M7 10h2.5v7H7zM8.25 9a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM11 10h2.4v1h.03c.33-.63 1.14-1.3 2.35-1.3C18.2 9.7 18.5 11.4 18.5 13V17H16v-3.5c0-.84-.02-1.93-1.18-1.93-1.18 0-1.36.92-1.36 1.87V17H11z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Dashboard",   href: "/dashboard" },
  { label: "Career Path", href: "/career-path" },
  { label: "Roadmap",     href: "/roadmap" },
  { label: "Scholarships",href: "/scholarships" },
];

const resourceLinks = [
  { label: "Study Material",      href: "/study-material" },
  { label: "Practice Tests",      href: "/practice-tests" },
  { label: "AI Insights",         href: "/ai-insights" },
  { label: "Performance Reports", href: "/performance-reports" },
];

const contactLinks = [
  { icon: <MailIcon />,     label: "support@shikhasetu.ai",    href: "mailto:support@shikhasetu.ai" },
  { icon: <GitHubIcon />,   label: "github.com/shikhasetu",    href: "https://github.com/shikhasetu" },
  { icon: <LinkedInIcon />, label: "linkedin.com/in/shikhasetu", href: "https://linkedin.com/in/shikhasetu" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FooterLinkItem = ({ href, label }) => (
  <li>
    <a href={href} className="footer-link">
      <span className="footer-link-arrow"><ArrowRightIcon /></span>
      {label}
    </a>
  </li>
);

const FooterContactItem = ({ icon, label, href }) => (
  <li>
    <a href={href} className="footer-contact-link" target="_blank" rel="noopener noreferrer">
      <span className="footer-contact-icon">{icon}</span>
      {label}
    </a>
  </li>
);

const SocialButton = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    className="footer-social-btn"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

// ─── Main Footer ─────────────────────────────────────────────────────────────

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Inject scoped styles */}
      <style>{`
        /* ── Fonts ───────────────────────────────────────────────── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@600;700;800&family=Space+Grotesk:wght@400;500&display=swap');

        /* ── Footer Shell ───────────────────────────────────────── */
        .ss-footer {
          background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
          position: relative;
          font-family: 'Inter', sans-serif;
          color: #e9e6f7;
          overflow: hidden;
        }

        /* top glow divider */
        .ss-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(168, 164, 255, 0.5) 30%,
            rgba(108, 99, 255, 0.9) 50%,
            rgba(168, 164, 255, 0.5) 70%,
            transparent 100%
          );
        }

        /* decorative ambient glow blob */
        .ss-footer::after {
          content: '';
          position: absolute;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse at center, rgba(108, 99, 255, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Inner Container ─────────────────────────────────────── */
        .ss-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 0;
          position: relative;
          z-index: 1;
        }

        /* ── Grid ────────────────────────────────────────────────── */
        .ss-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          gap: 48px;
        }

        /* ── Brand Column ────────────────────────────────────────── */
        .ss-footer-brand {}

        .ss-brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Manrope', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-decoration: none;
          margin-bottom: 12px;
        }

        .ss-brand-logo-icon {
          background: linear-gradient(135deg, #6c63ff, #a855f7);
          border-radius: 8px;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(108, 99, 255, 0.4);
        }

        .ss-brand-logo-text {
          background: linear-gradient(90deg, #a8a4ff, #e67aff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ss-brand-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a8a4ff;
          margin-bottom: 14px;
        }

        .ss-brand-description {
          font-size: 0.875rem;
          line-height: 1.7;
          color: #aba9b9;
          max-width: 280px;
          margin-bottom: 28px;
        }

        /* ── Social Buttons ──────────────────────────────────────── */
        .ss-social-row {
          display: flex;
          gap: 10px;
        }

        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(168, 164, 255, 0.2);
          color: #aba9b9;
          background: rgba(43, 42, 60, 0.4);
          backdrop-filter: blur(8px);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-social-btn:hover {
          color: #a8a4ff;
          border-color: rgba(168, 164, 255, 0.6);
          background: rgba(108, 99, 255, 0.15);
          box-shadow: 0 0 16px rgba(108, 99, 255, 0.35);
          transform: translateY(-2px);
        }

        /* ── Section Columns ─────────────────────────────────────── */
        .ss-footer-section {}

        .ss-section-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #757482;
          margin-bottom: 20px;
        }

        .ss-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* ── Nav / Resource Links ────────────────────────────────── */
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: #aba9b9;
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
          position: relative;
        }

        .footer-link-arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          color: #a8a4ff;
          display: flex;
          align-items: center;
        }

        .footer-link:hover {
          color: #a8a4ff;
          transform: translateX(4px);
        }

        .footer-link:hover .footer-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Contact Links ───────────────────────────────────────── */
        .footer-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #aba9b9;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .footer-contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(43, 42, 60, 0.7);
          border: 1px solid rgba(168, 164, 255, 0.1);
          color: #757482;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .footer-contact-link:hover {
          color: #a8a4ff;
        }

        .footer-contact-link:hover .footer-contact-icon {
          background: rgba(108, 99, 255, 0.18);
          border-color: rgba(168, 164, 255, 0.4);
          color: #a8a4ff;
        }

        /* ── Bottom Bar ──────────────────────────────────────────── */
        .ss-footer-bottom {
          margin-top: 64px;
          padding: 24px 40px;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .ss-footer-bottom::before {
          content: '';
          position: absolute;
          top: 0; left: 40px; right: 40px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(71, 71, 84, 0.6) 20%,
            rgba(71, 71, 84, 0.6) 80%,
            transparent
          );
        }

        .ss-copyright {
          font-size: 0.8rem;
          color: #757482;
          font-family: 'Space Grotesk', sans-serif;
        }

        .ss-made-with {
          font-size: 0.8rem;
          color: #757482;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ss-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .ss-footer-brand {
            grid-column: 1 / -1;
          }
          .ss-brand-description {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .ss-footer-inner {
            padding: 48px 24px 0;
          }
          .ss-footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .ss-footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
            padding: 24px;
          }
          .ss-footer-bottom::before {
            left: 24px; right: 24px;
          }
        }
      `}</style>

      <footer className="ss-footer" role="contentinfo">
        <div className="ss-footer-inner">
          <div className="ss-footer-grid">

            {/* ── Column 1: Brand ─────────────────────────────────── */}
            <div className="ss-footer-brand">
              <a href="/" className="ss-brand-logo">
                <span className="ss-brand-logo-icon">
                  <BoltIcon />
                </span>
                <span className="ss-brand-logo-text">EduVeda</span>
              </a>
              <p className="ss-brand-tagline">{t('footer.tagline')}</p>
              <p className="ss-brand-description">
                {t('footer.description')}
              </p>
              <div className="ss-social-row">
                <SocialButton href="mailto:support@eduveda.ai"          label="Email"    icon={<MailIcon />} />
                <SocialButton href="https://github.com/eduveda"         label="GitHub"   icon={<GitHubIcon />} />
                <SocialButton href="https://linkedin.com/in/eduveda"    label="LinkedIn" icon={<LinkedInIcon />} />
              </div>
            </div>

            {/* ── Column 2: Platform ──────────────────────────────── */}
            <div className="ss-footer-section">
              <h3 className="ss-section-heading">{t('footer.platform')}</h3>
              <ul className="ss-link-list">
                {navLinks.map((link) => (
                  <FooterLinkItem key={link.label} {...link} label={t(`footer.links.${link.label}`)} />
                ))}
              </ul>
            </div>

            {/* ── Column 3: Resources ─────────────────────────────── */}
            <div className="ss-footer-section">
              <h3 className="ss-section-heading">{t('footer.resources')}</h3>
              <ul className="ss-link-list">
                {resourceLinks.map((link) => (
                  <FooterLinkItem key={link.label} {...link} label={t(`footer.links.${link.label}`)} />
                ))}
              </ul>
            </div>

            {/* ── Column 4: Contact ───────────────────────────────── */}
            <div className="ss-footer-section">
              <h3 className="ss-section-heading">{t('footer.contact')}</h3>
              <ul className="ss-link-list">
                {contactLinks.map((item) => (
                  <FooterContactItem key={item.label} {...item} />
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <div className="ss-footer-bottom">
          <span className="ss-copyright">
            {t('footer.copyright', { year: currentYear })}
          </span>
          <span className="ss-made-with">{t('footer.madeWith')}</span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
