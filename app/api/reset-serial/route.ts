import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Reset serial number manually
export async function POST(request: NextRequest) {
  try {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Get or create today's reset record
    let dailyReset = await prisma.dailyReset.findUnique({
      where: { resetDate: todayDate },
    });

    if (dailyReset) {
      // Update existing record to reset serial number to 0
      dailyReset = await prisma.dailyReset.update({
        where: { id: dailyReset.id },
        data: { lastSerialNumber: 0 },
      });
    } else {
      // Create new record with serial number 0
      dailyReset = await prisma.dailyReset.create({
        data: {
          resetDate: todayDate,
          lastSerialNumber: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين الرقم التسلسلي إلى الصفر بنجاح',
      currentSerial: 0,
    });
  } catch (error) {
    console.error('Reset serial error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين الرقم التسلسلي' },
      { status: 500 }
    );
  }
}

// GET - Get current serial number
export async function GET() {
  try {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dailyReset = await prisma.dailyReset.findUnique({
      where: { resetDate: todayDate },
    });

    return NextResponse.json({
      currentSerial: dailyReset?.lastSerialNumber || 0,
      date: todayDate.toISOString(),
    });
  } catch (error) {
    console.error('Get serial error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرقم التسلسلي' },
      { status: 500 }
    );
  }
}

