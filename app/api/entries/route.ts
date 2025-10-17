import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export const runtime = 'nodejs';

// GET - Get entries (optionally filtered by date)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let where = {};

    if (date) {
      const targetDate = new Date(date);
      where = {
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
      };
    } else if (startDate && endDate) {
      where = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

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
        date: 'desc',
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Get entries error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب العمليات' },
      { status: 500 }
    );
  }
}

// POST - Create new entry
export async function POST(request: NextRequest) {
  try {
    const { numberOfCustomers, userId } = await request.json();

    if (!numberOfCustomers || !userId) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة غير موجودة' },
        { status: 400 }
      );
    }

    // Get current price
    const priceSetting = await prisma.settings.findUnique({
      where: { key: 'defaultPrice' },
    });

    const pricePerPerson = priceSetting ? parseFloat(priceSetting.value) : 50;

    // Get or create today's reset record
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let dailyReset = await prisma.dailyReset.findUnique({
      where: { resetDate: todayDate },
    });

    if (!dailyReset) {
      dailyReset = await prisma.dailyReset.create({
        data: {
          resetDate: todayDate,
          lastSerialNumber: 0,
        },
      });
    }

    // Increment serial number
    const serialNumber = dailyReset.lastSerialNumber + 1;

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        serialNumber,
        numberOfCustomers,
        pricePerPerson,
        totalAmount: numberOfCustomers * pricePerPerson,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    // Update daily reset
    await prisma.dailyReset.update({
      where: { id: dailyReset.id },
      data: { lastSerialNumber: serialNumber },
    });

    return NextResponse.json({ entry, message: 'تم إضافة العملية بنجاح' });
  } catch (error) {
    console.error('Create entry error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة العملية' },
      { status: 500 }
    );
  }
}

