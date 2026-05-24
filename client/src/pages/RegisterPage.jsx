import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password.trim()) nextErrors.password = 'Password is required.';
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords must match.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created', 'Your workspace is ready.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(
        'Registration failed',
        error?.response?.data?.message ?? 'Please try again with valid details.',
      );
      setErrors({ general: error?.response?.data?.message ?? 'Unable to register.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register once and unlock the full file tools studio with a polished dashboard and powerful workflows."
    >
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-6"
      >
        <Input
          label="Full name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Alex Morgan"
          error={errors.name}
        />
        <Input
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="alex@studio.com"
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Create a secure password"
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
        />

        {errors.general ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {errors.general}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Link to="/auth/login" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            Already have an account?
          </Link>
          <Button type="submit" disabled={loading} className="min-w-36">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </AuthLayout>
  );
}

