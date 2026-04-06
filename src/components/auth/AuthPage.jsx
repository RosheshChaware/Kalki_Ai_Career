import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Loader2, AlertCircle, CheckCircle2,
  RefreshCw, MailCheck, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const INPUT_BASE =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200';

const firebaseError = (code) => {
  const map = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/email-not-verified': 'Please verify your email before login',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Only one sign-in window at a time.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};

// ─── Google Button ────────────────────────────────────────────────────────────

const GoogleButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
  >
    {loading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      /* Google SVG logo */
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )}
    <span>Continue with Google</span>
  </button>
);

// ─── Divider ──────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-xs text-textMuted font-medium">OR</span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

// ─── Password Field ───────────────────────────────────────────────────────────

const PasswordField = ({ id, label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-textMuted mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`${INPUT_BASE} pl-10 pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ─── Error Banner ─────────────────────────────────────────────────────────────

const ErrorBanner = ({ message }) =>
  message ? (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  ) : null;

// ─── Email Verification Screen ────────────────────────────────────────────────

const VerificationScreen = ({ email, password, onVerified, onBack }) => {
  const { checkEmailVerified, resendVerificationEmail } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const intervalRef = useRef(null);

  // Auto-poll every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const verified = await checkEmailVerified(email, password);
        if (verified) {
          clearInterval(intervalRef.current);
          setSuccess(true);
          setTimeout(() => onVerified(), 1200);
        }
      } catch (_) { /* silent */ }
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleCheckNow = async () => {
    setError('');
    setChecking(true);
    try {
      const verified = await checkEmailVerified(email, password);
      if (verified) {
        setSuccess(true);
        setTimeout(() => onVerified(), 1200);
      } else {
        setError('Email not yet verified. Please click the link in your inbox.');
      }
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await resendVerificationEmail(email, password);
      setResendCooldown(60);
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
        <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold">Email Verified!</h2>
        <p className="text-textMuted text-sm">Signing you in…</p>
        <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Animated envelope icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <MailCheck className="w-12 h-12 text-primary" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">1</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
        <p className="text-textMuted text-sm max-w-xs leading-relaxed">
          Verification email sent. Please check your inbox.
        </p>
        <p className="text-primary font-semibold text-sm mt-1 break-all">{email}</p>
      </div>

      {/* Steps */}
      <div className="w-full text-left space-y-3 bg-white/3 rounded-2xl p-5 border border-white/5">
        {[
          { step: '1', text: 'Open the email from EduVeda' },
          { step: '2', text: 'Click the "Verify email address" button' },
          { step: '3', text: 'Come back here and click the button below' },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3 text-sm text-textMuted">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {step}
            </div>
            {text}
          </div>
        ))}
      </div>

      <ErrorBanner message={error} />

      {/* CTA button */}
      <button
        onClick={handleCheckNow}
        disabled={checking}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25"
      >
        {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> I've verified my email</>}
      </button>

      {/* Resend + back */}
      <div className="flex items-center justify-between w-full text-sm">
        <button
          onClick={onBack}
          className="text-textMuted hover:text-white transition-colors"
        >
          ← Back to Sign Up
        </button>
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || resending}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
        </button>
      </div>
    </div>
  );
};

// ─── Sign In Form ─────────────────────────────────────────────────────────────

const SignInForm = ({ onSwitch, onSuccess, onVerificationRequired }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (err) {
      setError(firebaseError(err.code));
      if (err.code === 'auth/email-not-verified') {
        // Transition to verification screen so they can resend email
        onVerificationRequired?.(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <Divider />

      {/* Email */}
      <div>
        <label htmlFor="signin-email" className="block text-xs font-medium text-textMuted mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={`${INPUT_BASE} pl-10`}
          />
        </div>
      </div>

      <PasswordField
        id="signin-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />

      <ErrorBanner message={error} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
      </button>

      <p className="text-center text-sm text-textMuted pt-1">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-primary hover:text-primary/80 font-semibold transition-colors">
          Sign up free
        </button>
      </p>
    </form>
  );
};

// ─── Sign Up Form ─────────────────────────────────────────────────────────────

const SignUpForm = ({ onSwitch, onVerificationSent }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = (() => {
    if (!password) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await signUp(email, password, name.trim());
      onVerificationSent(email, password); // move to verification screen
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Google accounts are auto-verified — close modal via success
      window.location.reload(); // simplest way to propagate auth state
    } catch (err) {
      setError(firebaseError(err.code));
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <Divider />

      {/* Name */}
      <div>
        <label htmlFor="signup-name" className="block text-xs font-medium text-textMuted mb-1.5">Full name</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anish Kumar"
            required
            className={`${INPUT_BASE} pl-10`}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className="block text-xs font-medium text-textMuted mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={`${INPUT_BASE} pl-10`}
          />
        </div>
      </div>

      {/* Password + strength */}
      <div>
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
        />
        {strength && (
          <div className="mt-2">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${
                strength === 'strong' ? 'bg-green-500 w-full' :
                strength === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
              }`} />
            </div>
            <p className={`text-xs mt-1 capitalize ${
              strength === 'strong' ? 'text-green-400' :
              strength === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>{strength} password</p>
          </div>
        )}
      </div>

      {/* Confirm */}
      <div>
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
        />
        {confirm && password && (
          <p className={`text-xs mt-1.5 flex items-center gap-1 ${confirm === password ? 'text-green-400' : 'text-red-400'}`}>
            {confirm === password
              ? <><CheckCircle2 className="w-3.5 h-3.5" /> Passwords match</>
              : <><AlertCircle className="w-3.5 h-3.5" /> Passwords don't match</>}
          </p>
        )}
      </div>

      <ErrorBanner message={error} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
      </button>

      <p className="text-center text-sm text-textMuted pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-primary hover:text-primary/80 font-semibold transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
};

// ─── Left Branding Panel ──────────────────────────────────────────────────────

const BrandPanel = ({ mode }) => (
  <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary/30 via-primary/10 to-background p-10 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

    <div className="relative z-10 flex items-center gap-2">
      <GraduationCap className="text-primary w-7 h-7" />
      <span className="text-2xl font-bold tracking-tight">EduVeda</span>
    </div>

    <div className="relative z-10">
      <h2 className="text-3xl font-bold leading-tight mb-4 whitespace-pre-line">
        {mode === 'signin' ? 'Welcome\nback 👋' : mode === 'verify' ? 'Almost\nthere! 📬' : 'Start your\njourney 🚀'}
      </h2>
      <p className="text-textMuted text-sm leading-relaxed mb-8">
        {mode === 'signin'
          ? 'Sign in to access your personalized career dashboard and recommendations.'
          : mode === 'verify'
          ? 'Check your inbox and click the link to complete your account setup.'
          : 'Join 10,000+ students who found their perfect career path with AI-powered guidance.'}
      </p>
      <ul className="space-y-3">
        {['AI-powered subject recommendations', 'Personalized college shortlisting', 'Career outcome insights', 'Free scholarship alerts'].map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-textMuted">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
            {item}
          </li>
        ))}
      </ul>
    </div>
    <p className="relative z-10 text-xs text-textMuted">© 2026 EduVeda. All rights reserved.</p>
  </div>
);

// ─── Auth Page (container) ────────────────────────────────────────────────────

const AuthPage = ({ defaultMode = 'signin', onSuccess, onClose }) => {
  // mode: 'signin' | 'signup' | 'verify'
  const [mode, setMode] = useState(defaultMode);
  const [verifyData, setVerifyData] = useState({ email: '', password: '' });

  const handleVerificationSent = (email, password) => {
    setVerifyData({ email, password });
    setMode('verify');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ maxHeight: '90vh' }}
      >
        {/* Branding */}
        <BrandPanel mode={mode} />

        {/* Form panel */}
        <div className="bg-surface/95 backdrop-blur-xl p-8 md:p-10 overflow-y-auto">
          {/* Mobile logo + close */}
          <div className="flex items-center justify-between mb-6 md:mb-0">
            <div className="flex items-center gap-2 md:hidden">
              <GraduationCap className="text-primary w-5 h-5" />
              <span className="font-bold">EduVeda</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto text-textMuted hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
              >
                ✕ Close
              </button>
            )}
          </div>

          {mode !== 'verify' && (
            <div className="mb-6 md:mt-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
              </h1>
              <p className="text-textMuted text-sm">
                {mode === 'signin' ? 'Enter your credentials below' : 'Fill in your details to get started'}
              </p>
            </div>
          )}

          {mode === 'signin' && (
            <SignInForm
              onSwitch={() => setMode('signup')}
              onSuccess={onSuccess}
              onVerificationRequired={handleVerificationSent}
            />
          )}

          {mode === 'signup' && (
            <SignUpForm
              onSwitch={() => setMode('signin')}
              onVerificationSent={handleVerificationSent}
            />
          )}

          {mode === 'verify' && (
            <div className="md:mt-4">
              <VerificationScreen
                email={verifyData.email}
                password={verifyData.password}
                onVerified={onSuccess}
                onBack={() => setMode('signup')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
