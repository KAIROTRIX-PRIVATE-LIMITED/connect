import { NextResponse } from 'next/server';
import { getContactSettings, saveContactSettings } from '@/lib/storage';

export async function GET() {
  const settings = getContactSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'kairotrix2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const updated = saveContactSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
