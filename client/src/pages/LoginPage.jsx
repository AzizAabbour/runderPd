import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const initialForm = {
  email: '',
  password: '',
};

export function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password.trim()) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back', 'You are now signed in.');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Login failed', error?.response?.data?.message ?? 'Please check your credentials.');
      setErrors({ general: error?.response?.data?.message ?? 'Unable to sign in.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage files, track jobs, and use a premium dashboard built for speed."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-6"
      >
        <Input
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="you@company.com"
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Enter your password"
          error={errors.password}
        />

        {errors.general ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {errors.general}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Link to="/auth/register" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            Need an account?
          </Link>
          <Button type="submit" disabled={loading} className="min-w-36">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </AuthLayout>
  );
}

