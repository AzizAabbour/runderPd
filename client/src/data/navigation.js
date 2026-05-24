import {
  LayoutDashboard,
  WandSparkles,
  History,
  Settings,
  FolderKanban,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Tools', path: '/dashboard/tools', icon: WandSparkles },
  { label: 'History', path: '/dashboard/history', icon: History },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const publicActions = [
  { label: 'Explore Tools', href: '/dashboard/tools', icon: FolderKanban },
  { label: 'Login', href: '/auth/login' },
];

