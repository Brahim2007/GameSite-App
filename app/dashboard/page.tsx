'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import EntryForm from '@/components/EntryForm';
import Receipt from '@/components/Receipt';
import TodayStats from '@/components/TodayStats';
import RecentEntries from '@/components/RecentEntries';
import { Entry } from '@/lib/types';
import { mockSettings, mockTodayEntries } from '@/lib/mockData';
import { getSerialNumber, formatCurrency, formatDateTime } from '@/lib/utils';

function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [currentPrice, setCurrentPrice] = useState(50);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lastEntry, setLastEntry] = useState<Entry | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [businessName, setBusinessName] = useState('مدينة الألعاب الترفيهية');
  const [currency, setCurrency] = useState('ريال');
  const [logoUrl, setLogoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const fetchTodayData = useCallback(async () => {
    if (!user) return;
    
    try {
      const params = new URLSearchParams({
        userId: user.id,
        userRole: user.role,
      });
      
      const response = await fetch(`/api/entries/today?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries.map((e: any) => ({
          ...e,
          adminName: e.user?.name || 'غير معروف',
          adminId: e.user?.id || '',
        })));
      }
    } catch (error) {
      console.error('Error fetching today data:', error);
    }
  }, [user]);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        console.log('Settings loaded:', data.settings);
        
        if (data.settings.defaultPrice) {
          setCurrentPrice(parseFloat(data.settings.defaultPrice.value));
        }
        if (data.settings.businessName) {
          setBusinessName(data.settings.businessName.value);
        }
        if (data.settings.currency) {
          setCurrency(data.settings.currency.value);
        }
        if (data.settings.logoUrl) {
          console.log('Logo URL loaded, length:', data.settings.logoUrl.value.length);
          setLogoUrl(data.settings.logoUrl.value);
        } else {
          console.log('No logo URL found in settings');
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  // Fetch today's entries and settings
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTodayData();
      fetchSettings();
    }
  }, [isAuthenticated, user, fetchTodayData, fetchSettings]);

  const handleNewEntry = async (numberOfCustomers: number) => {
    if (!user || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numberOfCustomers,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newEntry: Entry = {
          ...data.entry,
          adminName: data.entry.user?.name || user.name || 'غير معروف',
          adminId: data.entry.user?.id || user.id || '',
        };
        
        setEntries([...entries, newEntry]);
        setLastEntry(newEntry);
        setShowReceipt(true);

        // Auto print after a short delay
        setTimeout(() => {
          handlePrint();
        }, 500);
      } else {
        console.error('Failed to create entry');
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (!lastEntry) return;
    
    // Create print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة الوصل');
      return;
    }

    // Build receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>وصل - ${businessName}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
            width: 80mm;
            margin: 0 auto;
            padding: 5mm;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: white;
          }
          .logo-container {
            text-align: center;
            margin-bottom: 10px;
          }
          .logo-container img {
            max-height: 50px;
            max-width: 70mm;
            object-fit: contain;
          }
          h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
          }
          .subtitle {
            text-align: center;
            font-size: 11pt;
            margin-bottom: 10px;
          }
          .divider {
            border-top: 2px dashed #000;
            margin: 8px 0;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 11pt;
          }
          .total-box {
            border: 3px double #000;
            padding: 10px;
            margin: 10px 0;
            text-align: center;
          }
          .total-label {
            font-size: 11pt;
            margin-bottom: 5px;
          }
          .total-amount {
            font-size: 20pt;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            font-size: 10pt;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #000;
          }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        ${logoUrl ? `<div class="logo-container"><img src="${logoUrl}" alt="${businessName}"></div>` : ''}
        <h1>${businessName}</h1>
        <div class="subtitle">وصل دخول</div>
        <div class="divider"></div>
        <div class="row">
          <span>رقم الوصل:</span>
          <span class="bold">#${lastEntry.serialNumber.toString().padStart(4, '0')}</span>
        </div>
        <div class="row">
          <span>التاريخ:</span>
          <span class="bold">${formatDateTime(lastEntry.date)}</span>
        </div>
        <div class="row">
          <span>الموظف:</span>
          <span>${lastEntry.adminName}</span>
        </div>
        <div class="divider"></div>
        <div class="row">
          <span>عدد الزبائن:</span>
          <span class="bold">${lastEntry.numberOfCustomers}</span>
        </div>
        <div class="row">
          <span>السعر الفردي:</span>
          <span>${formatCurrency(lastEntry.pricePerPerson, currency)}</span>
        </div>
        <div class="divider"></div>
        <div class="total-box">
          <div class="total-label">المجموع الكلي</div>
          <div class="total-amount">${formatCurrency(lastEntry.totalAmount, currency)}</div>
        </div>
        <div class="footer">
          <div class="bold">شكراً لزيارتكم</div>
          <div>نتمنى لكم وقتاً ممتعاً</div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const stats = {
    totalCustomers: entries.reduce((sum, e) => sum + e.numberOfCustomers, 0),
    totalAmount: entries.reduce((sum, e) => sum + e.totalAmount, 0),
    numberOfTransactions: entries.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">لوحة التحكم الرئيسية</h1>
          <p className="text-sm sm:text-base text-gray-600">
            إدارة دخول الزبائن - {new Date().toLocaleDateString('en-GB')}
            {user?.role !== 'admin' && (
              <span className="mr-2 text-primary-600 font-medium block sm:inline mt-1 sm:mt-0">
                (عملياتي فقط)
              </span>
            )}
          </p>
        </div>

        <TodayStats {...stats} currency={currency} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <EntryForm currentPrice={currentPrice} onSubmit={handleNewEntry} isSubmitting={isSubmitting} currency={currency} />
          
          {/* Receipt Preview */}
          {showReceipt && lastEntry && (
            <div className="card">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">معاينة الوصل</h2>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200">
                <Receipt entry={lastEntry} businessName={businessName} logoUrl={logoUrl} currency={currency} />
              </div>
              <button
                onClick={handlePrint}
                className="w-full mt-4 btn btn-primary btn-touch"
              >
                طباعة الوصل
              </button>
            </div>
          )}
        </div>

        <RecentEntries entries={entries} currency={currency} />
      </div>

    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  );
}

