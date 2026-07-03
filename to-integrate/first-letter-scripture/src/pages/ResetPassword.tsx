import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if user arrived via reset link (they'll have a session from the magic link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      } else {
        toast.error('Invalid or expired reset link. Please request a new one.');
        navigate('/auth');
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const passwordValidation = passwordSchema.safeParse(password);
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

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      navigate('/');
    }

    setLoading(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Verifying reset link...</p>
      </div>
    );
  }

  if (!hasSession) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 w-full max-w-[90vw] sm:max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[2px] text-foreground mb-2">
            RESET PASSWORD
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[1.5px] text-muted-foreground font-medium">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="mb-5">
            <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-sm py-3 px-3.5"
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              8+ characters, uppercase, lowercase, and number required
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider text-muted-foreground mb-2 uppercase">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="text-sm py-3 px-3.5"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="bg-transparent border-none text-muted-foreground text-xs cursor-pointer hover:text-foreground transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
