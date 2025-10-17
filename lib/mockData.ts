import { User, Entry, DailySummary, Settings } from './types';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', username: 'admin', name: 'أحمد محمد', role: 'admin' },
  { id: '2', username: 'reception1', name: 'فاطمة علي', role: 'reception' },
  { id: '3', username: 'reception2', name: 'محمود حسن', role: 'reception' },
];

// Mock Settings
export const mockSettings: Settings = {
  defaultPrice: 50,
  businessName: 'مدينة الألعاب الترفيهية',
  logoUrl: '',
  lastPriceUpdate: new Date('2025-10-15'),
  updatedBy: 'أحمد محمد',
};

// Generate Mock Entries for Today
const generateTodayEntries = (): Entry[] => {
  const entries: Entry[] = [];
  const today = new Date();
  const admins = ['أحمد محمد', 'فاطمة علي', 'محمود حسن'];
  
  for (let i = 0; i < 15; i++) {
    const entryDate = new Date(today);
    entryDate.setHours(9 + Math.floor(i / 2), (i % 2) * 30, 0);
    
    entries.push({
      id: `entry-${i + 1}`,
      serialNumber: i + 1,
      numberOfCustomers: Math.floor(Math.random() * 5) + 1,
      pricePerPerson: 50,
      totalAmount: (Math.floor(Math.random() * 5) + 1) * 50,
      date: entryDate,
      adminName: admins[Math.floor(Math.random() * admins.length)],
      adminId: String(Math.floor(Math.random() * 3) + 1),
    });
  }
  
  return entries;
};

// Generate Mock Entries for Previous Days
const generatePreviousDaysEntries = (daysAgo: number): Entry[] => {
  const entries: Entry[] = [];
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysAgo);
  const admins = ['أحمد محمد', 'فاطمة علي', 'محمود حسن'];
  
  const numEntries = Math.floor(Math.random() * 10) + 10;
  
  for (let i = 0; i < numEntries; i++) {
    const entryDate = new Date(targetDate);
    entryDate.setHours(9 + Math.floor(i / 2), (i % 2) * 30, 0);
    
    entries.push({
      id: `entry-${daysAgo}-${i + 1}`,
      serialNumber: i + 1,
      numberOfCustomers: Math.floor(Math.random() * 5) + 1,
      pricePerPerson: 50,
      totalAmount: (Math.floor(Math.random() * 5) + 1) * 50,
      date: entryDate,
      adminName: admins[Math.floor(Math.random() * admins.length)],
      adminId: String(Math.floor(Math.random() * 3) + 1),
    });
  }
  
  return entries;
};

// Mock Today's Entries
export const mockTodayEntries = generateTodayEntries();

// Generate Daily Summaries for the current month
export const generateMockDailySummaries = (): DailySummary[] => {
  const summaries: DailySummary[] = [];
  const today = new Date();
  const currentDay = today.getDate();
  
  // Generate summaries for each day of the current month up to today
  for (let i = 0; i < currentDay; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    const entries = i === currentDay - 1 ? mockTodayEntries : generatePreviousDaysEntries(currentDay - i - 1);
    
    const totalCustomers = entries.reduce((sum, entry) => sum + entry.numberOfCustomers, 0);
    const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    
    summaries.push({
      date: date.toISOString().split('T')[0],
      totalCustomers,
      totalAmount,
      numberOfTransactions: entries.length,
      entries,
    });
  }
  
  return summaries.reverse();
};

export const mockDailySummaries = generateMockDailySummaries();

