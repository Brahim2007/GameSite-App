'use client';

import React from 'react';
import Link from 'next/link';
import { Entry } from '@/lib/types';
import { formatCurrency, formatTime, toArabicNumbers, formatNumber } from '@/lib/utils';
import { Clock, ArrowLeft } from 'lucide-react';

interface RecentEntriesProps {
  entries: Entry[];
  currency?: string;
}

export default function RecentEntries({ entries, currency = 'ريال' }: RecentEntriesProps) {
  const recentEntries = entries.slice(0, 10).reverse(); // Show last 10 entries
  const totalEntries = entries.length;
  const hasMore = totalEntries > 10;

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2 space-x-reverse">
          <Clock className="w-5 h-5 text-primary-600" />
          <span>آخر العمليات</span>
          {hasMore && (
            <span className="text-xs sm:text-sm font-normal text-gray-500 mr-2">
              (عرض {recentEntries.length} من {formatNumber(totalEntries)})
            </span>
          )}
        </h3>
      </div>

      <div className="table-responsive">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">رقم الوصل</th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">الوقت</th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">عدد الزبائن</th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">المبلغ</th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">الموظف</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 py-8 text-center text-sm sm:text-base text-gray-500">
                  لا توجد عمليات حتى الآن
                </td>
              </tr>
            ) : (
              recentEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-900">
                    #{toArabicNumbers(entry.serialNumber.toString().padStart(4, '0'))}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {formatTime(entry.date)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                    {formatNumber(entry.numberOfCustomers)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-green-600 whitespace-nowrap">
                    {formatCurrency(entry.totalAmount, currency)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                    {(entry as any).user?.name || 'غير معروف'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <Link 
            href="/daily-report"
            className="inline-flex items-center space-x-2 space-x-reverse text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>عرض جميع العمليات اليوم ({formatNumber(totalEntries)})</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

