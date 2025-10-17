'use client';

import React from 'react';
import { Entry } from '@/lib/types';
import { formatCurrency, formatDateTime, toArabicNumbers, formatNumber } from '@/lib/utils';

interface ReceiptProps {
  entry: Entry;
  businessName: string;
  logoUrl?: string;
  currency?: string;
}

export default function Receipt({ entry, businessName, logoUrl, currency = 'ريال' }: ReceiptProps) {
  return (
    <div className="bg-white p-8 max-w-md mx-auto thermal-receipt" id="receipt">
      {/* Header */}
      <div className="text-center pb-3 mb-3" style={{ borderBottom: '2px solid #333' }}>
        {logoUrl && (
          <div className="flex justify-center mb-3">
            <img 
              src={logoUrl} 
              alt={businessName}
              className="max-h-16 object-contain"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{businessName}</h1>
        <p className="text-gray-700 text-sm">وصل دخول</p>
      </div>

      {/* Receipt Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">رقم الوصل:</span>
          <span className="font-bold">#{entry.serialNumber.toString().padStart(4, '0')}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700">التاريخ:</span>
          <span className="font-medium">{formatDateTime(entry.date)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700">الموظف:</span>
          <span className="font-medium">{(entry as any).user?.name || 'غير معروف'}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider" style={{ borderTop: '2px dashed #333', margin: '12px 0' }}></div>

      {/* Pricing Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">عدد الزبائن:</span>
          <span className="font-bold text-xl">{formatNumber(entry.numberOfCustomers)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700">السعر الفردي:</span>
          <span className="font-medium">{formatCurrency(entry.pricePerPerson, currency)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider" style={{ borderTop: '2px dashed #333', margin: '12px 0' }}></div>

      {/* Total */}
      <div className="total-section text-center py-3 mb-4" style={{ border: '3px double #000' }}>
        <div className="text-sm text-gray-700 mb-1">المجموع الكلي</div>
        <div className="text-3xl font-bold text-black">
          {formatCurrency(entry.totalAmount, currency)}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-xs pt-3" style={{ borderTop: '1px solid #333' }}>
        <p className="font-semibold">شكراً لزيارتكم</p>
        <p>نتمنى لكم وقتاً ممتعاً</p>
      </div>
    </div>
  );
}

