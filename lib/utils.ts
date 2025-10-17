import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Keep Arabic (Western) numbers as is - no conversion
export function toArabicNumbers(str: string | number): string {
  return String(str);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatCurrency(amount: number, currency: string = 'ريال'): string {
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

export function formatDate(date: Date): string {
  // Format as DD/MM/YYYY in Gregorian calendar
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getSerialNumber(): number {
  // This would normally fetch from storage and reset daily
  // For demo, we'll use a random number
  return Math.floor(Math.random() * 100) + 1;
}

export function resetDailyData(): void {
  // This would reset the serial number and daily data
  console.log('تم تصفير البيانات اليومية');
}

