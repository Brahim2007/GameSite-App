import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  return NextResponse.json({ DATABASE_URL_present: !!process.env.DATABASE_URL });
}
