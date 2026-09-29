import fs from 'fs';
import path from 'path';
import { ContactSettings, AnalyticsEvent, AnalyticsSummary } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'contact-settings.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics-log.json');

const defaultSettings: ContactSettings = {
  companyName: "KAIROTRIX",
  tagline: "BUILT TO EVOLVE",
  phone: "+1 (800) 555-0199",
  whatsapp: "+1 (800) 555-0199",
  email: "connect@kairotrix.com",
  website: "https://kairotrix.com",
  bookingUrl: "https://kairotrix.com/book",
  showBookingBtn: true,
  address: "San Francisco, CA, United States",
  notes: "Leading enterprise artificial intelligence & autonomous systems.",
  updatedAt: new Date().toISOString(),
  secondaryLinks: [
    {
      id: "link-1",
      type: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/company/kairotrix",
      position: 1,
      enabled: true
    },
    {
      id: "link-2",
      type: "instagram",
      label: "Instagram",
      url: "https://instagram.com/kairotrix",
      position: 2,
      enabled: true
    },
    {
      id: "link-3",
      type: "website",
      label: "Official Website",
      url: "https://kairotrix.com",
      position: 3,
      enabled: true
    },
    {
      id: "link-4",
      type: "x",
      label: "X / Twitter",
      url: "https://x.com/kairotrix",
      position: 4,
      enabled: true
    }
  ]
};

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

export function getContactSettings(): ContactSettings {
  try {
    ensureDataDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      inMemorySettings = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Error reading contact settings file, returning default:', err);
  }
  if (inMemorySettings) {
    return inMemorySettings;
  }
  inMemorySettings = defaultSettings;
  return defaultSettings;
}

export function saveContactSettings(settings: Partial<ContactSettings>): ContactSettings {
  const current = getContactSettings();
  const updated: ContactSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  inMemorySettings = updated;

  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write contact settings to disk, saved in memory:', err);
  }

  return updated;
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
