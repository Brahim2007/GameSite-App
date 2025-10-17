import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    // Build where clause
    let where: any = {
      date: {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate),
      },
    };

    // If RECEPTION role, filter by userId
    if (userRole === 'reception' && userId) {
      where.userId = userId;
    }
    // If ADMIN, show all entries

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

    const totalCustomers = entries.reduce((sum, entry) => sum + entry.numberOfCustomers, 0);
    const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const numberOfTransactions = entries.length;

    return NextResponse.json({
      date: targetDate.toISOString().split('T')[0],
      entries,
      totalCustomers,
      totalAmount,
      numberOfTransactions,
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التقرير اليومي' },
      { status: 500 }
    );
  }
}

