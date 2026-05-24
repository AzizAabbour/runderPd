import { useState } from 'react';
import { CheckCircle2, Globe2, Palette, ShieldCheck, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSave = () => {
    toast.success('Settings saved', 'Your preferences are updated locally for this demo.');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Personalize your workspace"
        description="Adjust appearance, language, and basic account details with a polished control surface."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Profile</h3>
              <p className="text-sm text-slate-400">Edit your basic account information.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Button className="mt-6" onClick={handleSave}>
            <CheckCircle2 className="h-4 w-4" />
            Save profile
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
                <p className="text-sm text-slate-400">Switch between dark and light mode.</p>
              </div>
            </div>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Language</h3>
                <p className="text-sm text-slate-400">Toggle the interface language instantly.</p>
              </div>
            </div>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Security</h3>
                <p className="text-sm text-slate-400">JWT-based auth and upload validation ready.</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              This UI is built to support secure tokens, upload checks, and production-ready API
              guards when connected to the backend.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

