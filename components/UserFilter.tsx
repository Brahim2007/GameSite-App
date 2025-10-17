'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Users as UsersIcon } from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface UserFilterProps {
  currentUser: any;
  onFilterChange: (userId: string | null, filterType: 'all' | 'user' | 'me') => void;
}

export default function UserFilter({ currentUser, onFilterChange }: UserFilterProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

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

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);

    if (value === 'all') {
      onFilterChange(null, 'all');
    } else if (value === 'me') {
      onFilterChange(currentUser.id, 'me');
    } else {
      onFilterChange(value, 'user');
    }
  };

  // Only show filter for admins
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="bg-primary-600 rounded-full p-2">
          <Filter className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            فلترة البيانات حسب الموظف:
          </label>
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="input w-full md:w-auto min-w-[300px]"
          >
            <option value="all">🌐 جميع الموظفين (جميع البيانات)</option>
            <option value="me">👤 عملياتي فقط</option>
            <optgroup label="────────────────">
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.role === 'ADMIN' ? '👑' : '👤'} {user.name} ({user.username})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {selectedFilter !== 'all' && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
            📊 عرض مفلتر
          </div>
        )}
      </div>
    </div>
  );
}

