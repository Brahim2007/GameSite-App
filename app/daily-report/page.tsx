'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';
import UserFilter from '@/components/UserFilter';
import StaffStats from '@/components/StaffStats';
import { Download, FileText, Printer, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatTime, toArabicNumbers, formatNumber } from '@/lib/utils';
import { exportDailyReportToPDF, exportDailyReportToExcel } from '@/lib/exportUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DailyReportPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReport();
      fetchSettings();
    }
  }, [isAuthenticated, user, selectedDate, filteredUserId, filterType]);

  const fetchReport = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate,
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
      
      const response = await fetch(`/api/reports/daily?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (userId: string | null, type: 'all' | 'user' | 'me') => {
    setFilteredUserId(userId);
    setFilterType(type);
  };

  const fetchSettings = async () => {
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
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (reportData) {
      const summary = {
        date: reportData.date,
        entries: reportData.entries,
        totalCustomers: reportData.totalCustomers,
        totalAmount: reportData.totalAmount,
        numberOfTransactions: reportData.numberOfTransactions,
      };
      exportDailyReportToPDF(summary, businessName, currency);
    }
  };

  const handleExportExcel = () => {
    if (reportData) {
      const summary = {
        date: reportData.date,
        entries: reportData.entries,
        totalCustomers: reportData.totalCustomers,
        totalAmount: reportData.totalAmount,
        numberOfTransactions: reportData.numberOfTransactions,
      };
      exportDailyReportToExcel(summary);
    }
  };

  // Prepare data for chart
  const hourlyData = reportData ? Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    const entriesInHour = reportData.entries.filter((e: any) => {
      const entryHour = new Date(e.date).getHours();
      return entryHour === hour;
    });
    
    return {
      hour: `${hour}:00`,
      customers: entriesInHour.reduce((sum: number, e: any) => sum + e.numberOfCustomers, 0),
      amount: entriesInHour.reduce((sum: number, e: any) => sum + e.totalAmount, 0),
    };
  }) : [];

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !reportData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">التقرير اليومي</h1>
            <p className="text-sm sm:text-base text-gray-600">
              ملخص عمليات اليوم والإحصائيات
              {user?.role !== 'admin' && (
                <span className="text-primary-600 font-medium mr-2 block sm:inline mt-1 sm:mt-0">
                  - عملياتي فقط
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 no-print">
            <button onClick={handlePrint} className="btn btn-secondary btn-touch flex items-center space-x-2 space-x-reverse text-sm sm:text-base px-3 sm:px-4">
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
            <button onClick={handleExportPDF} className="btn btn-primary btn-touch flex items-center space-x-2 space-x-reverse text-sm sm:text-base px-3 sm:px-4">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button onClick={handleExportExcel} className="btn btn-success btn-touch flex items-center space-x-2 space-x-reverse text-sm sm:text-base px-3 sm:px-4">
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* User Filter - For Admins */}
        {user?.role === 'admin' && (
          <UserFilter currentUser={user} onFilterChange={handleFilterChange} />
        )}

        {/* Date Selector */}
        <div className="card mb-8 no-print">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Calendar className="w-5 h-5 text-primary-600" />
            <label className="font-medium text-gray-700">اختر التاريخ:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input max-w-xs"
            />
          </div>
        </div>

        {/* Staff Performance Stats - Only when viewing all */}
        {user?.role === 'admin' && filterType === 'all' && reportData && reportData.entries.length > 0 && (
          <StaffStats entries={reportData.entries} currency={currency} />
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium mb-1">إجمالي الزبائن</p>
                <p className="text-4xl font-bold text-blue-900">{formatNumber(reportData.totalCustomers)}</p>
              </div>
              <div className="bg-blue-500 rounded-full p-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium mb-1">إجمالي المبلغ</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(reportData.totalAmount, currency)}</p>
              </div>
              <div className="bg-green-500 rounded-full p-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-800 font-medium mb-1">عدد العمليات</p>
                <p className="text-4xl font-bold text-purple-900">{formatNumber(reportData.numberOfTransactions)}</p>
              </div>
              <div className="bg-purple-500 rounded-full p-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="card mb-6 sm:mb-8 no-print">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">توزيع الزبائن حسب الساعة</h2>
          {reportData.entries.length > 0 ? (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[500px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData} margin={{ top: 20, right: 15, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      label={{ value: 'الساعة', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
                      tickLine={{ strokeWidth: 2 }}
                      tickMargin={10}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      tickLine={{ strokeWidth: 2 }}
                      tickMargin={10}
                      tick={{ dx: -10, fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'amount') return [formatCurrency(value, currency), 'المبلغ'];
                        return [formatNumber(value), 'الزبائن'];
                      }}
                      labelFormatter={(label) => `الساعة ${toArabicNumbers(label)}`}
                      contentStyle={{ fontSize: '13px' }}
                    />
                    <Legend 
                      formatter={(value) => value === 'customers' ? 'عدد الزبائن' : `المبلغ (${currency})`}
                      wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    />
                    <Bar dataKey="customers" fill="#3b82f6" name="customers" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="amount" fill="#10b981" name="amount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">لا توجد عمليات لهذا اليوم</p>
                <p className="text-xs text-gray-400 mt-1">قم بإضافة عمليات لرؤية الرسم البياني</p>
              </div>
            </div>
          )}
        </div>

        {/* Entries Table */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">تفاصيل العمليات</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم الوصل</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الوقت</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الزبائن</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">السعر الفردي</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">المبلغ الإجمالي</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الموظف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      لا توجد عمليات في هذا التاريخ
                    </td>
                  </tr>
                ) : (
                  reportData.entries.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        #{toArabicNumbers(entry.serialNumber.toString().padStart(4, '0'))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatTime(new Date(entry.date))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {formatNumber(entry.numberOfCustomers)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatCurrency(entry.pricePerPerson, currency)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">
                        {formatCurrency(entry.totalAmount, currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.user?.name || entry.adminName || 'غير معروف'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {reportData.entries.length > 0 && (
                <tfoot className="bg-gradient-to-r from-blue-100/50 via-green-100/50 to-purple-100/50">
                  <tr className="font-bold border-t-4 border-primary-500">
                    <td colSpan={2} className="px-4 py-4 text-sm text-gray-900">المجموع الكلي</td>
                    <td className="px-4 py-4 text-lg text-blue-700">{formatNumber(reportData.totalCustomers)}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">-</td>
                    <td className="px-4 py-4 text-lg text-green-700 font-extrabold">{formatCurrency(reportData.totalAmount, currency)}</td>
                    <td className="px-4 py-4 text-sm text-purple-700">{formatNumber(reportData.numberOfTransactions)} عملية</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <DailyReportPage />
    </AuthProvider>
  );
}
