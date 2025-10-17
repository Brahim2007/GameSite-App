import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfDay, endOfDay } from 'date-fns';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get('month'); // Format: YYYY-MM
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    
    let targetDate = new Date();
    if (monthParam) {
      const [year, month] = monthParam.split('-');
      targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    }

    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    // Build where clause
    let where: any = {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    };

    // If RECEPTION role, filter by userId
    if (userRole === 'reception' && userId) {
      where.userId = userId;
    }
    // If ADMIN, show all entries

    // Get all entries for the month
    const entries = await prisma.entry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by day
    const days = eachDayOfInterval({ start: monthStart, end: new Date() });
    const dailySummaries = days.map(day => {
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entryDate >= startOfDay(day) &&
          entryDate <= endOfDay(day)
        );
      });

      return {
        date: format(day, 'yyyy-MM-dd'),
        entries: dayEntries,
        totalCustomers: dayEntries.reduce((sum, e) => sum + e.numberOfCustomers, 0),
        totalAmount: dayEntries.reduce((sum, e) => sum + e.totalAmount, 0),
        numberOfTransactions: dayEntries.length,
      };
    });

    // Calculate monthly totals
    const totalCustomers = entries.reduce((sum, e) => sum + e.numberOfCustomers, 0);
    const totalAmount = entries.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalTransactions = entries.length;

    return NextResponse.json({
      month: format(targetDate, 'MMMM'),
      year: targetDate.getFullYear(),
      dailySummaries,
      totalCustomers,
      totalAmount,
      totalTransactions,
      numberOfDays: dailySummaries.length,
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التقرير الشهري' },
      { status: 500 }
    );
  }
}

