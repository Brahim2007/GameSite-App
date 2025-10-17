'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, FileText, Calendar, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState('مدينة الألعاب الترفيهية');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings.businessName) {
            setBusinessName(data.settings.businessName.value);
          }
        }
      } catch (error) {
        console.error('Error fetching business name:', error);
      }
    };

    fetchSettings();
    
    // Re-fetch when navigating (to update after settings change)
    const handleFocus = () => fetchSettings();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, [pathname]);

  const navItems = [
    { href: '/dashboard', label: 'الرئيسية', icon: Home },
    { href: '/daily-report', label: 'التقرير اليومي', icon: FileText },
    { href: '/monthly-report', label: 'التقرير الشهري', icon: Calendar },
    ...(user?.role === 'admin' ? [
      { href: '/users', label: 'المستخدمين', icon: User },
      { href: '/settings', label: 'الإعدادات', icon: Settings },
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-primary-600">
              {businessName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            <div className="flex space-x-4 space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.name}</span>
                <span className="text-sm text-gray-500">
                  ({user?.role === 'admin' ? 'مدير' : 'موظف استقبال'})
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="قائمة التنقل"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            {/* User Info */}
            <div className="flex items-center space-x-3 space-x-reverse py-4 px-2 border-b border-gray-200">
              <div className="bg-primary-100 p-2 rounded-full">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">
                  {user?.role === 'admin' ? 'مدير' : 'موظف استقبال'}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

