'use client';

import React, { useState } from 'react';
import { Users, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface EntryFormProps {
  currentPrice: number;
  onSubmit: (numberOfCustomers: number) => void;
  isSubmitting?: boolean;
  currency?: string;
}

export default function EntryForm({ currentPrice, onSubmit, isSubmitting = false, currency = 'ريال' }: EntryFormProps) {
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(1);
  const totalAmount = numberOfCustomers * currentPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numberOfCustomers > 0) {
      onSubmit(numberOfCustomers);
      setNumberOfCustomers(1); // Reset after submission
    }
  };

  const handleIncrement = () => setNumberOfCustomers(prev => prev + 1);
  const handleDecrement = () => setNumberOfCustomers(prev => Math.max(1, prev - 1));

  return (
    <div className="card">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">إدخال زبائن جدد</h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Number of Customers */}
          <div>
            <label className="label flex items-center space-x-2 space-x-reverse">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <span className="text-sm sm:text-base">عدد الزبائن</span>
            </label>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={handleDecrement}
                className="btn btn-secondary btn-touch px-6 py-3 text-2xl font-bold flex-shrink-0"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={numberOfCustomers}
                onChange={(e) => setNumberOfCustomers(Math.max(1, parseInt(e.target.value) || 1))}
                className="input text-center text-xl sm:text-2xl font-bold flex-1"
              />
              <button
                type="button"
                onClick={handleIncrement}
                className="btn btn-secondary btn-touch px-6 py-3 text-2xl font-bold flex-shrink-0"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Information */}
          <div>
            <label className="label flex items-center space-x-2 space-x-reverse">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              <span className="text-sm sm:text-base">السعر الحالي</span>
            </label>
            <div className="input bg-gray-100 text-xl sm:text-2xl font-bold text-primary-700">
              {formatCurrency(currentPrice, currency)}
            </div>
          </div>
        </div>

        {/* Total Amount Display */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">المبلغ الإجمالي</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary-700">
              {formatCurrency(totalAmount, currency)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {numberOfCustomers} × {formatCurrency(currentPrice, currency)}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn btn-success btn-touch py-4 sm:py-5 text-lg sm:text-xl flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-b-2 border-white"></div>
              <span>جاري الإدخال...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>إدخال وطباعة الوصل</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

