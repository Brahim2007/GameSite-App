'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, User as UserIcon, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt: Date;
  _count?: {
    entries: number;
  };
}

interface UserManagementProps {
  onUserChange?: () => void;
}

export default function UserManagement({ onUserChange }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'RECEPTION',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم إضافة المستخدم بنجاح');
        setShowAddModal(false);
        setFormData({ username: '', password: '', name: '', role: 'RECEPTION' });
        fetchUsers();
        onUserChange?.(); // Notify parent component
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'فشل في إضافة المستخدم');
      }
    } catch (error) {
      setError('حدث خطأ أثناء إضافة المستخدم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم تحديث بيانات المستخدم بنجاح');
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
        onUserChange?.(); // Notify parent component
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'فشل في تحديث المستخدم');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تحديث المستخدم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم حذف المستخدم بنجاح');
        fetchUsers();
        onUserChange?.(); // Notify parent component
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'فشل في حذف المستخدم');
      }
    } catch (error) {
      setError('حدث خطأ أثناء حذف المستخدم');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({ username: '', password: '', name: '', role: 'RECEPTION' });
    setError('');
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-primary-100 rounded-full p-3">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h2>
            <p className="text-sm text-gray-600">إضافة وتعديل حسابات الموظفين</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 space-x-reverse">
          <AlertCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 space-x-reverse">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم المستخدم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الدور</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد العمليات</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 ml-1" />
                        مدير
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <UserIcon className="w-3 h-3 ml-1" />
                        استقبال
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user._count?.entries || 0} عملية
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">إضافة مستخدم جديد</h3>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="label">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">اسم المستخدم</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">كلمة المرور</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">الدور</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input"
                >
                  <option value="RECEPTION">موظف استقبال</option>
                  <option value="ADMIN">مدير</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 btn btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">تعديل بيانات المستخدم</h3>

            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="label">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">اسم المستخدم (لا يمكن تعديله)</label>
                <input
                  type="text"
                  value={formData.username}
                  className="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="label">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد التغيير)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder="اتركها فارغة للإبقاء على القديمة"
                />
              </div>

              <div>
                <label className="label">الدور</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input"
                >
                  <option value="RECEPTION">موظف استقبال</option>
                  <option value="ADMIN">مدير</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'جاري التحديث...' : 'تحديث'}
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 btn btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

