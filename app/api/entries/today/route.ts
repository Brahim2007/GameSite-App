import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');
    
    const today = new Date();
    
    // Build where clause based on user role
    let where: any = {
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    };

    // If RECEPTION role, filter by userId
    if (userRole === 'reception' && userId) {
      where.userId = userId;
    }
    // If ADMIN, show all entries (no userId filter)
    
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

    // Calculate stats
    const totalCustomers = entries.reduce((sum, entry) => sum + entry.numberOfCustomers, 0);
    const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const numberOfTransactions = entries.length;

    return NextResponse.json({
      entries,
      stats: {
        totalCustomers,
        totalAmount,
        numberOfTransactions,
      },
    });
  } catch (error) {
    console.error('Get today entries error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب عمليات اليوم' },
      { status: 500 }
    );
  }
}

