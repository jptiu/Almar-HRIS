// resources/js/config/navigationConfig.js
import {
  LayoutDashboard,
  Users,
  UserCog,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  Info,
  User,
  CalendarDays,
  Receipt,
  UsersRound,
  Clock,
  ClipboardList,
  Coins,
  CreditCard,
  MegaphoneIcon,
  Megaphone,
} from 'lucide-react';

/**
 * Navigation configuration for each role
 * Defines sidebar menu items with icons and paths
 */
export const navigationConfig = {
  admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      label: 'User Management',
      icon: Users,
      path: '/admin/users',
    },
    {
      label: 'HR Management',
      icon: UserCog,
      path: '/admin/hr-management',
    },
    {
      label: 'Reports & Analytics',
      icon: BarChart3,
      path: '/admin/reports',
    },
    {
      label: 'System Settings',
      icon: Settings,
      path: '/admin/settings',
    },
    {
      label: 'Audit Logs',
      icon: FileText,
      path: '/admin/audit-logs',
    },
  ],

  hr: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/hr/dashboard',
    },
    {
      label: 'Employees',
      icon: Users,
      path: '/hr/employees',
    },
    {
      label: 'Documents',
      icon: FileText,
      path: '/hr/documents',
    },
    {
      label: 'Attendance',
      icon: Clock,
      path: '/hr/attendance',
      // badge: '5', // Example badge for pending requests
    },
    {
      label: 'Leave Credits',
      icon: Calendar,
      path: '/hr/leave-credits',
    },
    {
      label: 'Requests',
      icon: ClipboardList,
      path: '/hr/requests',
    },
    {
      label: 'Concerns',
      icon: Info,
      path: '/hr/concerns',
    },
    {
      label: 'Payroll',
      icon: DollarSign,
      path: '/hr/payroll',
    },
    {
      label: 'Contributions',
      icon: Coins,
      path: '/hr/contributions',
    },
    {
      label: 'Salary Management',
      icon: CreditCard,
      path: '/hr/salary-management',
    },
    {
      label: 'Announcements',
      icon: Megaphone,
      path: '/hr/announcements',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/hr/settings',
    },
  ],

  manager: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/hr/dashboard',
    },
    {
      label: 'Employees',
      icon: Users,
      path: '/hr/employees',
    },
    {
      label: 'Documents',
      icon: FileText,
      path: '/hr/documents',
    },
    {
      label: 'Attendance',
      icon: Clock,
      path: '/hr/attendance',
      // badge: '5', // Example badge for pending requests
    },
    {
      label: 'Leave Credits',
      icon: Calendar,
      path: '/hr/leave-credits',
    },
    {
      label: 'Requests',
      icon: ClipboardList,
      path: '/hr/requests',
    },
    {
      label: 'Concerns',
      icon: Info,
      path: '/hr/concerns',
    },
    {
      label: 'Payroll',
      icon: DollarSign,
      path: '/hr/payroll',
    },
    {
      label: 'Contributions',
      icon: Coins,
      path: '/hr/contributions',
    },
    {
      label: 'Salary Management',
      icon: CreditCard,
      path: '/hr/salary-management',
    },
    {
      label: 'Announcements',
      icon: Megaphone,
      path: '/hr/announcements',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/hr/settings',
    },
  ],

  employee: [
    {
      label: 'My Dashboard',
      icon: LayoutDashboard,
      path: '/employee/dashboard',
    },
    {
      label: 'My Profile',
      icon: User,
      path: '/employee/profile',
    },
    {
      label: 'Leave Requests',
      icon: CalendarDays,
      path: '/employee/leave-requests',
    },
    {
      label: 'Payslips',
      icon: Receipt,
      path: '/employee/payslips',
    },
    {
      label: 'Team Directory',
      icon: UsersRound,
      path: '/employee/team-directory',
    },
  ],
};

/**
 * Get navigation items for a specific role
 * 
 * @param {string} role - User role
 * @returns {Array} Navigation items
 */
export const getNavigationForRole = (role) => {
  return navigationConfig[role] || [];
};

/**
 * Find navigation item by path
 * 
 * @param {string} role - User role
 * @param {string} path - Path to find
 * @returns {Object|null} Navigation item or null
 */
export const findNavigationItem = (role, path) => {
  const items = navigationConfig[role] || [];
  return items.find((item) => item.path === path) || null;
};
