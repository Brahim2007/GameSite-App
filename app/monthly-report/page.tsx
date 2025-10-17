'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';
import UserFilter from '@/components/UserFilter';
import StaffStats from '@/components/StaffStats';
import { Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatNumber, toArabicNumbers } from '@/lib/utils';
import { exportMonthlyReportToPDF, exportMonthlyReportToExcel } from '@/lib/exportUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MonthlyReportPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState<any>(null);
  const [businessName, setBusinessName] = useState('مدينة الألعاب الترفيهية');
  const [currency, setCurrency] = useState('ريال');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredUserId, setFilteredUserId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'user' | 'me'>('all');
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const fetchReport = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
      });

      // Determine which user data to fetch
      if (user.role === 'admin') {
        if (filterType === 'all') {
          // Show all - no userId filter
          params.append('userRole', 'admin'); // Signal admin to show all
        } else if (filterType === 'me') {
          params.append('userId', user.id);
          params.append('userRole', 'reception'); // Filter to user's entries
        } else if (filteredUserId) {
          params.append('userId', filteredUserId);
          params.append('userRole', 'reception'); // Filter to specific user
        }
      } else {
        // Reception always sees their own entries
        params.append('userId', user.id);
        params.append('userRole', user.role);
      }
      
      const response = await fetch(`/api/reports/monthly?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedMonth, filteredUserId, filterType]);

  const handleFilterChange = (userId: string | null, type: 'all' | 'user' | 'me') => {
    setFilteredUserId(userId);
    setFilterType(type);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings.businessName) {
          setBusinessName(data.settings.businessName.value);
        }
        if (data.settings.currency) {
          setCurrency(data.settings.currency.value);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReport();
      fetchSettings();
    }
  }, [isAuthenticated, user, selectedMonth, filteredUserId, filterType, fetchReport, fetchSettings]);

  const handleFilterChange = (userId: string | null, type: 'all' | 'user' | 'me') => {
    setFilteredUserId(userId);
    setFilterType(type);
  };

  const handleExportPDF = () => {
    if (reportData) {
      exportMonthlyReportToPDF(
        reportData.dailySummaries, 
        reportData.month, 
        reportData.year,
        businessName,
        currency
      );
    }
  };

  const handleExportExcel = () => {
    if (reportData) {
      exportMonthlyReportToExcel(
        reportData.dailySummaries, 
        reportData.month, 
        reportData.year
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Prepare chart data - include all days with data
  const chartData = reportData ? reportData.dailySummaries
    .filter((s: any) => s.totalCustomers > 0) // Only days with customers
    .map((summary: any) => ({
      date: new Date(summary.date).getDate().toString(),
      customers: summary.totalCustomers,
      amount: summary.totalAmount,
    })) : [];

  const hasChartData = chartData.length > 0;

  const averageDaily = reportData && reportData.numberOfDays > 0 
    ? reportData.totalAmount / reportData.numberOfDays 
    : 0;

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !reportData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقرير الشهري</h1>
            <p className="text-gray-600">
              ملخص عمليات الشهر والإحصائيات
              {user?.role !== 'admin' && (
                <span className="text-primary-600 font-medium mr-2">
                  - عملياتي فقط
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse no-print">
            <button onClick={handlePrint} className="btn btn-secondary flex items-center space-x-2 space-x-reverse">
              <Download className="w-4 h-4" />
              <span>طباعة</span>
            </button>
            <button onClick={handleExportPDF} className="btn btn-primary flex items-center space-x-2 space-x-reverse">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button onClick={handleExportExcel} className="btn btn-success flex items-center space-x-2 space-x-reverse">
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* User Filter - For Admins */}
        {user?.role === 'admin' && (
          <UserFilter currentUser={user} onFilterChange={handleFilterChange} />
        )}

        {/* Month Selector */}
        <div className="card mb-8 no-print">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Calendar className="w-5 h-5 text-primary-600" />
            <label className="font-medium text-gray-700">اختر الشهر:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input max-w-xs"
            />
            <span className="text-lg font-semibold text-gray-800">{reportData.month} {reportData.year}</span>
          </div>
        </div>

        {/* Staff Performance Stats - Only when viewing all */}
        {user?.role === 'admin' && filterType === 'all' && reportData && reportData.totalTransactions > 0 && (
          <StaffStats entries={reportData.dailySummaries.flatMap((d: any) => d.entries)} currency={currency} />
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium mb-1">إجمالي الزبائن</p>
                <p className="text-3xl font-bold text-blue-900">{formatNumber(reportData.totalCustomers)}</p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium mb-1">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.totalAmount, currency)}</p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-800 font-medium mb-1">عدد الأيام</p>
                <p className="text-3xl font-bold text-purple-900">{formatNumber(reportData.numberOfDays)}</p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-medium mb-1">المتوسط اليومي</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(Math.round(averageDaily), currency)}</p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8 no-print">
          {/* Daily Customers Chart */}
          <div className="card">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">عدد الزبائن اليومي</h2>
            {hasChartData ? (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[500px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 15, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: 'اليوم', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
                        tickLine={{ strokeWidth: 2 }}
                        tickMargin={10}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        label={{ value: 'عدد الزبائن', angle: -90, position: 'insideLeft' }}
                        tickLine={{ strokeWidth: 2 }}
                        tickMargin={10}
                        tick={{ dx: -10, fontSize: 11 }}
                      />
                      <Tooltip 
                        labelFormatter={(label) => `اليوم ${toArabicNumbers(label)}`}
                        formatter={(value: number) => [formatNumber(value), 'الزبائن']}
                        contentStyle={{ fontSize: '13px' }}
                      />
                      <Legend formatter={() => 'عدد الزبائن'} wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-sm font-medium">لا توجد بيانات لعرضها</p>
                  <p className="text-xs text-gray-400 mt-1">قم بإضافة عمليات لرؤية الرسم البياني</p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Revenue Chart */}
          <div className="card">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">الإيرادات اليومية</h2>
            {hasChartData ? (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[500px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 15, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        label={{ value: 'اليوم', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
                        tickLine={{ strokeWidth: 2 }}
                        tickMargin={10}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        label={{ value: `المبلغ (${currency})`, angle: -90, position: 'insideLeft' }}
                        tickLine={{ strokeWidth: 2 }}
                        tickMargin={10}
                        tick={{ dx: -10, fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value, currency), 'المبلغ']}
                        labelFormatter={(label) => `اليوم ${toArabicNumbers(label)}`}
                        contentStyle={{ fontSize: '13px' }}
                      />
                      <Legend formatter={() => `المبلغ (${currency})`} wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">لا توجد بيانات لعرضها</p>
                  <p className="text-xs text-gray-400 mt-1">قم بإضافة عمليات لرؤية الرسم البياني</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Summary Table */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص يومي تفصيلي</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الزبائن</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">المبلغ الإجمالي</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.dailySummaries
                  .filter((s: any) => s.totalCustomers > 0)
                  .map((summary: any) => (
                    <tr key={summary.date} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {new Date(summary.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(summary.totalCustomers)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">
                        {formatCurrency(summary.totalAmount, currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(summary.numberOfTransactions)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-100/50 via-green-100/50 to-purple-100/50">
                <tr className="font-bold border-t-4 border-primary-500">
                  <td className="px-4 py-4 text-sm text-gray-900">المجموع الكلي</td>
                  <td className="px-4 py-4 text-lg text-blue-700">{formatNumber(reportData.totalCustomers)}</td>
                  <td className="px-4 py-4 text-lg text-green-700 font-extrabold">{formatCurrency(reportData.totalAmount, currency)}</td>
                  <td className="px-4 py-4 text-sm text-purple-700">{formatNumber(reportData.totalTransactions)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-blue-50">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">أعلى يوم في عدد الزبائن</h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatNumber(Math.max(...reportData.dailySummaries.map((d: any) => d.totalCustomers)))}
            </p>
          </div>
          
          <div className="card bg-green-50">
            <h3 className="text-sm font-semibold text-green-800 mb-2">أعلى يوم في الإيرادات</h3>
            <p className="text-xl font-bold text-green-900">
              {formatCurrency(Math.max(...reportData.dailySummaries.map((d: any) => d.totalAmount)), currency)}
            </p>
          </div>
          
          <div className="card bg-purple-50">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">إجمالي العمليات</h3>
            <p className="text-2xl font-bold text-purple-900">{formatNumber(reportData.totalTransactions)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <MonthlyReportPage />
    </AuthProvider>
  );
}
