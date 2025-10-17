import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Get all settings
export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        updatedAt: setting.updatedAt,
        updatedBy: setting.updatedBy,
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ settings: settingsObject });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإعدادات' },
      { status: 500 }
    );
  }
}

// PUT - Update a setting
export async function PUT(request: NextRequest) {
  try {
    const { key, value, updatedBy } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'المفتاح والقيمة مطلوبة' },
        { status: 400 }
      );
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: {
        value: String(value),
        updatedBy,
      },
      create: {
        key,
        value: String(value),
        updatedBy,
      },
    });

    return NextResponse.json({
      setting,
      message: 'تم تحديث الإعدادات بنجاح',
    });
  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الإعدادات' },
      { status: 500 }
    );
  }
}

