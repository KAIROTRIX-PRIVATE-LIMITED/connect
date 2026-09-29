import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'kairotrix2026';

    if (password === adminPassword) {
      return NextResponse.json({ success: true, token: adminPassword });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
