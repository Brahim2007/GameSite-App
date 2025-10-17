'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';
import UserManagement from '@/components/UserManagement';
import { AlertCircle } from 'lucide-react';

function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
          <p className="text-gray-600">إضافة وتعديل وحذف حسابات الموظفين والمديرين</p>
        </div>

        <UserManagement onUserChange={fetchUsers} />

        {/* Info Card */}
        <div className="card mt-8 bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="bg-blue-500 rounded-full p-2 mt-1">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">ملاحظات مهمة:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• يمكنك إضافة عدد غير محدود من المستخدمين</li>
                <li>• كل مستخدم له اسم مستخدم فريد وكلمة مرور خاصة</li>
                <li>• يتم تسجيل اسم الموظف في كل عملية دخول</li>
                <li>• لا يمكن حذف مستخدم لديه عمليات مسجلة</li>
                <li>• المديرون فقط يمكنهم تعديل الأسعار وإدارة المستخدمين</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-center">
              <p className="text-purple-800 font-medium mb-2">إجمالي المستخدمين</p>
              <p className="text-4xl font-bold text-purple-900">{users.length}</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <p className="text-blue-800 font-medium mb-2">المديرون</p>
              <p className="text-4xl font-bold text-blue-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-center">
              <p className="text-green-800 font-medium mb-2">موظفو الاستقبال</p>
              <p className="text-4xl font-bold text-green-900">
                {users.filter(u => u.role === 'RECEPTION').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <UsersPage />
    </AuthProvider>
  );
}

