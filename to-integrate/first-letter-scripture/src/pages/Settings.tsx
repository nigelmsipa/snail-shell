import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAvailableVersions } from '@/hooks/useAvailableVersions';
import { supabase } from '@/integrations/supabase/client';

export default function Settings() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: versions = [] } = useAvailableVersions();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [preferredVersion, setPreferredVersion] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Load profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, preferred_version')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || '');
          setPreferredVersion(data.preferred_version || '');
        }
        setProfileLoaded(true);
      });
  }, [user]);

  // Redirect if not authed
  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, preferred_version: preferredVersion })
        .eq('id', user.id);

      if (error) throw error;

      // Sync display name to auth metadata
      await supabase.auth.updateUser({ data: { full_name: fullName } });

      toast({ title: 'Settings saved' });
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const res = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw res.error;

      await signOut();
      navigate('/auth');
    } catch {
      toast({ title: 'Failed to delete account', variant: 'destructive' });
      setDeleting(false);
    }
  };

  if (authLoading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-h2 font-bold text-foreground">Settings</h1>
        </div>

        {/* Display Name */}
        <section className="mb-8">
          <Label className="text-body-sm font-medium text-foreground mb-2 block">
            Display Name
          </Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="mb-3"
          />
        </section>

        {/* Default Bible Version */}
        <section className="mb-8">
          <Label className="text-body-sm font-medium text-foreground mb-2 block">
            Default Bible Version
          </Label>
          <Select value={preferredVersion} onValueChange={setPreferredVersion}>
            <SelectTrigger>
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.abbreviation}>
                  {v.abbreviation} — {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Save */}
        <Button onClick={handleSaveProfile} disabled={saving} className="w-full mb-10">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>

        {/* Appearance */}
        <section className="mb-10">
          <h2 className="text-h4 font-semibold text-foreground mb-4">Appearance</h2>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : theme === 'light' ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Monitor className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-body-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-caption text-muted-foreground">
                  {theme === 'system' ? 'Following system' : theme === 'dark' ? 'On' : 'Off'}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-lg border border-destructive/30 p-4">
          <h2 className="text-h4 font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-body-sm text-muted-foreground mb-4">
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data.
                  Type <span className="font-mono font-bold">DELETE</span> to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="font-mono"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirm('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}
