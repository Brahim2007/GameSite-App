'use client';

import React from 'react';
import { Users, DollarSign, FileText } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface TodayStatsProps {
  totalCustomers: number;
  totalAmount: number;
  numberOfTransactions: number;
  currency?: string;
}

export default function TodayStats({ totalCustomers, totalAmount, numberOfTransactions, currency = 'ريال' }: TodayStatsProps) {
  const stats = [
    {
      label: 'إجمالي الزبائن',
      value: formatNumber(totalCustomers),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'إجمالي المبلغ',
      value: formatCurrency(totalAmount, currency),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'عدد العمليات',
      value: formatNumber(numberOfTransactions),
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm mb-1 truncate">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3 sm:p-4 flex-shrink-0 mr-3`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

