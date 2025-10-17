'use client';

import React from 'react';
import { Users, TrendingUp, Award } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface StaffPerformance {
  userId: string;
  userName: string;
  userRole: string;
  numberOfEntries: number;
  totalCustomers: number;
  totalAmount: number;
}

interface StaffStatsProps {
  entries: any[];
  currency?: string;
}

export default function StaffStats({ entries, currency = 'ريال' }: StaffStatsProps) {
  // Group entries by user
  const staffPerformance: { [key: string]: StaffPerformance } = {};

  entries.forEach((entry) => {
    const userId = entry.user?.id || entry.userId;
    const userName = entry.user?.name || 'غير معروف';
    const userRole = entry.user?.role || 'RECEPTION';

    if (!staffPerformance[userId]) {
      staffPerformance[userId] = {
        userId,
        userName,
        userRole,
        numberOfEntries: 0,
        totalCustomers: 0,
        totalAmount: 0,
      };
    }

    staffPerformance[userId].numberOfEntries += 1;
    staffPerformance[userId].totalCustomers += entry.numberOfCustomers;
    staffPerformance[userId].totalAmount += entry.totalAmount;
  });

  const staffArray = Object.values(staffPerformance).sort(
    (a, b) => b.totalAmount - a.totalAmount
  );

  if (staffArray.length === 0) {
    return null;
  }

  // Find top performer
  const topPerformer = staffArray[0];

  return (
    <div className="card mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <div className="bg-purple-600 rounded-full p-3">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">أداء الموظفين</h2>
          <p className="text-sm text-gray-600">مقارنة إنجازات الموظفين</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffArray.map((staff, index) => (
          <div
            key={staff.userId}
            className={`p-4 rounded-lg border-2 ${
              index === 0
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                {index === 0 && <Award className="w-5 h-5 text-yellow-600" />}
                {staff.userRole === 'ADMIN' ? (
                  <span className="text-xl">👑</span>
                ) : (
                  <span className="text-xl">👤</span>
                )}
                <span className="font-bold text-gray-900">{staff.userName}</span>
              </div>
              {index === 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  الأفضل
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">عدد العمليات:</span>
                <span className="font-bold text-gray-900">{formatNumber(staff.numberOfEntries)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">عدد الزبائن:</span>
                <span className="font-bold text-blue-600">{formatNumber(staff.totalCustomers)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي المبلغ:</span>
                <span className="font-bold text-green-600">{formatCurrency(staff.totalAmount, currency)}</span>
              </div>

              {/* Percentage of total */}
              {entries.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>النسبة من الإجمالي:</span>
                    <span className="font-semibold">
                      {formatNumber(Math.round((staff.numberOfEntries / entries.length) * 100))}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

