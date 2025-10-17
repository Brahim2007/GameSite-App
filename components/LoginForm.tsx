'use client';

import React, { useState } from 'react';
import { LogIn, User, UserCheck } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoggingIn(true);
    const success = await onLogin(username, password);
    
    if (!success) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setIsLoggingIn(false);
    }
    // If success, the page will redirect so no need to reset isLoggingIn
  };

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مدينة الألعاب الترفيهية
          </h1>
          <p className="text-gray-600">نظام إدارة الزبائن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="أدخل اسم المستخدم"
              autoFocus
            />
          </div>

          <div>
            <label className="label">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
          >
            {isLoggingIn ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            حسابات تجريبية - اضغط للتعبئة التلقائية:
          </p>
          <div className="space-y-2">
            {/* Admin Button */}
            <button
              type="button"
              onClick={() => fillCredentials('admin', 'admin')}
              className="w-full text-right px-3 py-2.5 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">مدير النظام</p>
                    <p className="text-xs text-gray-500">admin / admin</p>
                  </div>
                </div>
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                  أدمن
                </div>
              </div>
            </button>

            {/* Reception 1 Button */}
            <button
              type="button"
              onClick={() => fillCredentials('reception1', 'reception1')}
              className="w-full text-right px-3 py-2.5 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">فاطمة علي</p>
                    <p className="text-xs text-gray-500">reception1 / reception1</p>
                  </div>
                </div>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  استقبال
                </div>
              </div>
            </button>

            {/* Reception 2 Button */}
            <button
              type="button"
              onClick={() => fillCredentials('reception2', 'reception2')}
              className="w-full text-right px-3 py-2.5 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">محمود حسن</p>
                    <p className="text-xs text-gray-500">reception2 / reception2</p>
                  </div>
                </div>
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  استقبال
                </div>
              </div>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 اضغط على أي حساب لملء البيانات تلقائياً
          </p>
        </div>
      </div>
    </div>
  );
}

