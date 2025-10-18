'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { DollarSign, Save, AlertCircle, Building2, Trash2, RefreshCw, Hash } from 'lucide-react';
import { mockSettings } from '@/lib/mockData';
import { formatCurrency, formatDateTime } from '@/lib/utils';

function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const [price, setPrice] = useState(50);
  const [businessName, setBusinessName] = useState('مدينة الألعاب الترفيهية');
  const [currency, setCurrency] = useState('ريال');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [saved, setSaved] = useState(false);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date>(new Date());
  const [updatedBy, setUpdatedBy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentSerial, setCurrentSerial] = useState(0);
  const [autoResetSerial, setAutoResetSerial] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      } else {
        fetchSettings();
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings.defaultPrice) {
          setPrice(parseFloat(data.settings.defaultPrice.value));
          setLastPriceUpdate(new Date(data.settings.defaultPrice.updatedAt));
          setUpdatedBy(data.settings.defaultPrice.updatedBy || '');
        }
        if (data.settings.businessName) {
          setBusinessName(data.settings.businessName.value);
        }
        if (data.settings.currency) {
          setCurrency(data.settings.currency.value);
        }
        if (data.settings.logoUrl) {
          setLogoUrl(data.settings.logoUrl.value);
          setLogoPreview(data.settings.logoUrl.value);
        }
        if (data.settings.autoResetSerial) {
          setAutoResetSerial(data.settings.autoResetSerial.value === 'true');
        }
      }
      // Fetch current serial number
      fetchCurrentSerial();
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchCurrentSerial = async () => {
    try {
      const response = await fetch('/api/reset-serial');
      if (response.ok) {
        const data = await response.json();
        setCurrentSerial(data.currentSerial);
      }
    } catch (error) {
      console.error('Error fetching current serial:', error);
    }
  };

  const handleResetSerial = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين الرقم التسلسلي إلى الصفر؟')) {
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch('/api/reset-serial', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSerial(data.currentSerial);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error resetting serial:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSaveAutoReset = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'autoResetSerial',
          value: String(autoResetSerial),
          updatedBy: user?.name,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving auto reset setting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCurrency = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'currency',
          value: currency,
          updatedBy: user?.name,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving currency:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. الحد الأقصى 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار صورة صحيحة');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      console.log('Saving logo, length:', logoUrl.length);
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'logoUrl',
          value: logoUrl,
          updatedBy: user?.name,
        }),
      });

      const data = await response.json();
      console.log('Save response:', data);

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Re-fetch to confirm
        await fetchSettings();
      } else {
        alert('فشل حفظ الشعار: ' + (data.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      alert('حدث خطأ أثناء حفظ الشعار');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrice = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'defaultPrice',
          value: price.toString(),
          updatedBy: user?.name,
        }),
      });

      if (response.ok) {
        setLastPriceUpdate(new Date());
        setUpdatedBy(user?.name || '');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving price:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBusinessName = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'businessName',
          value: businessName,
          updatedBy: user?.name,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving business name:', error);
    } finally {
      setIsSaving(false);
    }
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة الأسعار والإعدادات العامة</p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center space-x-2 space-x-reverse">
            <AlertCircle className="w-5 h-5" />
            <span>تم حفظ التغييرات بنجاح</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Settings */}
          <div className="card">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="bg-primary-100 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة السعر</h2>
                <p className="text-sm text-gray-600">تحديث سعر الدخول للفرد</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label">السعر الحالي</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input text-2xl font-bold text-primary-700"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {currency}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> بعد حفظ السعر الجديد، سيتم تطبيقه على جميع العمليات القادمة فوراً.
                </p>
              </div>

              <button
                onClick={handleSavePrice}
                disabled={isSaving}
                className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>حفظ السعر الجديد</span>
                  </>
                )}
              </button>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">آخر تحديث للسعر</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>التاريخ: {formatDateTime(lastPriceUpdate)}</p>
                  <p>بواسطة: {updatedBy || 'غير معروف'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Name Settings */}
          <div className="card">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="bg-purple-100 rounded-full p-3">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">معلومات المنشأة</h2>
                <p className="text-sm text-gray-600">تحديث اسم وشعار المنشأة</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label">اسم المنشأة</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input text-lg"
                  placeholder="مدينة الألعاب الترفيهية"
                />
              </div>

              <div>
                <label className="label">العملة المستخدمة</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input text-lg"
                >
                  <option value="ريال">ريال (السعودية)</option>
                  <option value="درهم">درهم (الإمارات/المغرب)</option>
                  <option value="دينار">دينار (الكويت/البحرين/الأردن/العراق/تونس/الجزائر/ليبيا)</option>
                  <option value="جنيه">جنيه (مصر/السودان)</option>
                  <option value="ليرة">ليرة (لبنان/سوريا/تركيا)</option>
                  <option value="ريال عماني">ريال عماني (عمان)</option>
                  <option value="ريال قطري">ريال قطري (قطر)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ستظهر في جميع الوصولات والتقارير
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSaveBusinessName}
                  disabled={isSaving}
                  className="btn btn-primary py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>حفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>حفظ الاسم</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveCurrency}
                  disabled={isSaving}
                  className="btn btn-success py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>حفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>حفظ العملة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Serial Number Reset Settings */}
          <div className="card">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="bg-orange-100 rounded-full p-3">
                <Hash className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">الرقم التسلسلي</h2>
                <p className="text-sm text-gray-600">إدارة تصفير الرقم التسلسلي اليومي</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Current Serial Number */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">الرقم التسلسلي الحالي</p>
                    <p className="text-3xl font-bold text-orange-600">{currentSerial}</p>
                  </div>
                  <div className="bg-white rounded-full p-4 shadow-md">
                    <Hash className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Auto Reset Option */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoResetSerial}
                        onChange={(e) => setAutoResetSerial(e.target.checked)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-semibold text-gray-900">تصفير تلقائي يومياً</span>
                        <p className="text-sm text-gray-600">يتم إعادة تعيين الرقم التسلسلي إلى 0 تلقائياً كل يوم</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveAutoReset}
                disabled={isSaving}
                className="w-full btn btn-primary py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>حفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>حفظ إعدادات التصفير التلقائي</span>
                  </>
                )}
              </button>

              {/* Manual Reset */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">إعادة تعيين يدوي</h3>
                <p className="text-sm text-gray-600 mb-4">
                  إذا كنت تريد إعادة تعيين الرقم التسلسلي إلى الصفر الآن، اضغط على الزر أدناه.
                </p>
                <button
                  onClick={handleResetSerial}
                  disabled={isResetting}
                  className="w-full btn bg-orange-600 hover:bg-orange-700 text-white py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>جاري التصفير...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>إعادة تعيين الرقم التسلسلي الآن</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>ملاحظة:</strong> عند تفعيل التصفير التلقائي، سيبدأ الرقم التسلسلي من 1 في بداية كل يوم جديد.
                </p>
              </div>
            </div>
          </div>

          {/* Logo Settings */}
          <div className="card">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">شعار المنشأة</h2>
                <p className="text-sm text-gray-600">رفع أو تحديث شعار المنشأة</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Logo Preview */}
              {logoPreview && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">معاينة الشعار:</p>
                  <div className="flex justify-center">
                    <img 
                      src={logoPreview} 
                      alt="شعار المنشأة" 
                      className="max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="label">رفع شعار من الكمبيوتر</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  صيغ مدعومة: PNG, JPG, SVG - الحد الأقصى: 2MB
                </p>
              </div>

              <div className="border-t pt-4">
                <label className="label">أو استخدم رابط الشعار</label>
                <input
                  type="text"
                  value={logoUrl.startsWith('data:') ? '' : logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoPreview(e.target.value);
                  }}
                  className="input"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> الشعار سيظهر في الوصولات المطبوعة والتقارير.
                </p>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  onClick={handleSaveLogo}
                  disabled={isSaving || !logoUrl}
                  className="flex-1 btn btn-success py-3 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>حفظ الشعار</span>
                    </>
                  )}
                </button>
                
                {logoUrl && (
                  <button
                    onClick={() => {
                      setLogoUrl('');
                      setLogoPreview('');
                    }}
                    className="btn btn-danger py-3 flex items-center space-x-2 space-x-reverse"
                  >
                    <span>حذف</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-1">السعر الحالي</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(price, currency)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-1">اسم المنشأة</p>
              <p className="text-lg font-bold text-green-900">{businessName}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm text-purple-800 mb-1">المستخدم الحالي</p>
              <p className="text-lg font-bold text-purple-900">{user?.name}</p>
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
      <SettingsPage />
    </AuthProvider>
  );
}

