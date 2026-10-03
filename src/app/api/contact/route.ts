import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContactSettings, saveContactSettings } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getContactSettings();
  return NextResponse.json({ success: true, data: settings }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'kairotrix2026';
    
    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const result = await saveContactSettings(body);

    revalidatePath('/connect');
    revalidatePath('/');
    revalidatePath('/admin/contact');

    return NextResponse.json({
      success: true,
      data: result.data,
      persisted: result.persisted,
      warning: result.warning,
    });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
