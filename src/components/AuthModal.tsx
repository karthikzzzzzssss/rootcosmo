import { useState } from 'react';
import { X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setFullName(''); setEmail(''); setPassword('');
    setError(''); setInfo(''); setDone(false); setSubmitting(false);
  };

  const close = () => { reset(); onClose(); };

  const switchMode = (m: Mode) => {
    setMode(m); setError(''); setInfo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');

    if (!email || !password || (mode === 'register' && !fullName)) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error);
        else close();
      } else {
        const { error, needsConfirm } = await signUp(email, password, fullName);
        if (error) {
          setError(error);
        } else if (needsConfirm) {
          setDone(true);
          setInfo('Account created! Please check your email to confirm your address, then log in.');
        } else {
          close(); // auto-signed in
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 rounded-t-2xl"
          style={{ background: 'linear-gradient(135deg, #5b0fa8 0%, #6d28d9 100%)' }}
        >
          <h2 className="text-white font-bold text-xl">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={close} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center text-center">
            <CheckCircle2 className="text-green-500 mb-4" size={56} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 text-sm mb-6">{info}</p>
            <button
              onClick={() => { setDone(false); switchMode('login'); }}
              className="w-full bg-purple-700 text-white font-semibold py-3 rounded-full hover:bg-purple-800 transition-colors"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Tabs */}
            <div className="flex rounded-full bg-purple-50 p-1 mb-2">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                    mode === m ? 'bg-purple-700 text-white' : 'text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {m === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-purple-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-700 text-white font-semibold py-3 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-gray-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-purple-700 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
