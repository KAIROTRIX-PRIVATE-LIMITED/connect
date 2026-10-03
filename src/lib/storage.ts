import fs from 'fs';
import path from 'path';
import { ContactSettings, AnalyticsEvent, AnalyticsSummary } from './types';
import fallbackSettingsData from '@/data/contact-settings.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'contact-settings.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics-log.json');

const defaultSettings: ContactSettings = fallbackSettingsData as ContactSettings;

// Memory fallback cache if FS writing is prohibited
let inMemorySettings: ContactSettings | null = null;
let inMemoryAnalytics: AnalyticsEvent[] | null = null;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create data directory, using in-memory store:', err);
  }
}

export function getKvConfig(): { url: string; token: string } | null {
  // Check standard variable names
  const directUrl =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_API_URL;
  const directToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_API_TOKEN;

  if (directUrl && directToken) {
    return { url: directUrl.replace(/\/$/, ''), token: directToken };
  }

  // Scan process.env for any dynamically prefixed Upstash/KV variables
  for (const [key, value] of Object.entries(process.env)) {
    if (
      value &&
      (key.includes('KV') || key.includes('REDIS') || key.includes('UPSTASH')) &&
      (key.endsWith('_REST_API_URL') || key.endsWith('_REST_URL') || key.endsWith('_URL'))
    ) {
      const prefix = key.replace(/_(REST_API_URL|REST_URL|URL)$/, '');
      const token =
        process.env[`${prefix}_REST_API_TOKEN`] ||
        process.env[`${prefix}_REST_TOKEN`] ||
        process.env[`${prefix}_TOKEN`];
      if (token && value.startsWith('http')) {
        return { url: value.replace(/\/$/, ''), token };
      }
    }
  }

  return null;
}

export async function getContactSettings(): Promise<ContactSettings> {
  const kv = getKvConfig();
  if (kv) {
    try {
      const res = await fetch(kv.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', 'contact_settings']),
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          inMemorySettings = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading contact settings from KV store:', err);
    }
  }

  try {
    ensureDataDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      inMemorySettings = parsed;
      return parsed;
    }
  } catch (err) {
    // Expected on serverless when directory is not extracted
  }

  if (inMemorySettings) {
    return inMemorySettings;
  }
  inMemorySettings = defaultSettings;
  return defaultSettings;
}

export async function saveContactSettings(settings: Partial<ContactSettings>): Promise<{ data: ContactSettings; persisted: boolean; warning?: string }> {
  const current = await getContactSettings();
  const updated: ContactSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  inMemorySettings = updated;
  let persisted = false;

  const kv = getKvConfig();
  if (kv) {
    try {
      const res = await fetch(kv.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', 'contact_settings', JSON.stringify(updated)]),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result === 'OK' || data.result) {
          persisted = true;
        }
      } else {
        console.error('Upstash SET failed with status:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Error saving contact settings to KV store:', err);
    }
  }

  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    persisted = true;
  } catch (err) {
    // Expected on read-only serverless
  }

  let warning: string | undefined;
  if (!persisted) {
    if (!kv) {
      warning = 'KV database not linked yet. Please REDEPLOY this project on Vercel so it attaches your newly created Upstash database.';
    } else {
      warning = 'Could not persist to KV store. Please check Vercel function logs.';
    }
  }

  return { data: updated, persisted, warning };
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (inMemoryAnalytics) {
    return inMemoryAnalytics;
  }
  try {
    ensureDataDir();
    if (fs.existsSync(ANALYTICS_FILE)) {
      const fileData = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      inMemoryAnalytics = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading analytics file:', err);
  }
  inMemoryAnalytics = [];
  return [];
}

export function recordAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
  const newEvent: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };

  const current = getAnalyticsEvents();
  const updated = [newEvent, ...current].slice(0, 5000); // keep last 5000 events

  inMemoryAnalytics = updated;

  try {
    ensureDataDir();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write analytics event to disk, saved in memory:', err);
  }

  return newEvent;
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = getAnalyticsEvents();

  let totalViews = 0;
  let totalCalls = 0;
  let totalWhatsApp = 0;
  let totalEmails = 0;
  let totalBookings = 0;
  let totalVcards = 0;
  let totalSocialClicks = 0;
  const sourceBreakdown: Record<string, number> = {};
  const dailyViews: Record<string, number> = {};

  events.forEach((evt) => {
    const src = evt.source || 'direct';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;

    const dateStr = evt.timestamp.substring(0, 10);

    switch (evt.event) {
      case 'contact_page_view':
        totalViews++;
        dailyViews[dateStr] = (dailyViews[dateStr] || 0) + 1;
        break;
      case 'contact_call_click':
        totalCalls++;
        break;
      case 'contact_whatsapp_click':
        totalWhatsApp++;
        break;
      case 'contact_email_click':
        totalEmails++;
        break;
      case 'contact_booking_click':
        totalBookings++;
        break;
      case 'contact_vcard_download':
        totalVcards++;
        break;
      case 'contact_social_click':
        totalSocialClicks++;
        break;
    }
  });

  return {
    totalViews,
    totalCalls,
    totalWhatsApp,
    totalEmails,
    totalBookings,
    totalVcards,
    totalSocialClicks,
    sourceBreakdown,
    dailyViews,
    events: events.slice(0, 100), // return last 100 for recent log view
  };
}
