import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().trim().email('Invalid email address');
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

type AuthView = 'login' | 'signup' | 'forgot' | 'reset-sent';

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for OAuth errors in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorDescription = hashParams.get('error_description');
    const error = hashParams.get('error');
    
    if (error || errorDescription) {
      toast.error(
        errorDescription || 'Authentication failed. Please try again.',
        { duration: 5000 }
      );
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.info('You have been signed out');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      setLoading(false);
      return;
    }

    if (!passwordValidation.success) {
      toast.error(passwordValidation.error.errors[0].message);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!fullName.trim()) {
      toast.error('Full name is required');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created! Please check your email to verify your account.');
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error('Password is required');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email before signing in');
      } else {
        toast.error(error.message);
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin
    });

    if (error) {
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(emailValidation.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      toast.error(error.message);
    } else {
      setView('reset-sent');
    }

    setLoading(false);
  };

  // Forgot password view
  if (view === 'forgot') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 w-full max-w-[90vw] sm:max-w-md">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[2px] text-foreground mb-2">
              RESET PASSWORD
            </h1>
            <p className="text-[10px] sm:text-xs tracking-[1.5px] text-muted-foreground font-medium">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="mb-6">
              <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm py-3 px-3.5"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setView('login');
                clearForm();
              }}
              className="bg-transparent border-none text-muted-foreground text-xs cursor-pointer hover:text-foreground transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reset email sent confirmation
  if (view === 'reset-sent') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 w-full max-w-[90vw] sm:max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <Button
            onClick={() => {
              setView('login');
              clearForm();
            }}
            variant="outline"
            className="w-full py-3.5 text-xs font-semibold tracking-wide"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Login / Signup view
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 w-full max-w-[90vw] sm:max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[2px] text-foreground mb-2">
            SCRIPTURE MEMORY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[1.5px] text-muted-foreground font-medium">
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <div className="mb-5">
              <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="text-sm py-3 px-3.5"
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm py-3 px-3.5"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-sm py-3 px-3.5"
            />
            {!isLogin && (
              <p className="text-[10px] text-muted-foreground mt-1.5">
                8+ characters, uppercase, lowercase, and number required
              </p>
            )}
            {isLogin && (
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="bg-transparent border-none text-[10px] text-primary cursor-pointer hover:underline mt-1.5"
              >
                Forgot Password?
              </button>
            )}
          </div>

          {!isLogin && (
            <div className="mb-6 sm:mb-8">
              <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-sm py-3 px-3.5"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6 sm:my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="w-full py-3.5 text-xs font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2.5"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40681 3.78409 7.82999 3.96409 7.28999V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setView(isLogin ? 'signup' : 'login');
              clearForm();
            }}
            className="bg-transparent border-none text-foreground font-semibold cursor-pointer underline hover:text-primary transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-transparent border-none text-muted-foreground text-xs cursor-pointer hover:text-foreground transition-colors"
          >
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}
