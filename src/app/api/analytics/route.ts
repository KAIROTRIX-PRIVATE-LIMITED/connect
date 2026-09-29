import { NextResponse } from 'next/server';
import { recordAnalyticsEvent, getAnalyticsSummary } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, source, target } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event name is required' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    const recorded = recordAnalyticsEvent({
      event,
      source,
      target,
      userAgent,
    });

    return NextResponse.json({ success: true, data: recorded });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'kairotrix2026';

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const summary = getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
