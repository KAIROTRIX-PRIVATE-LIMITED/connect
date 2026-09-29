export interface SecondaryLink {
  id: string;
  type: 'instagram' | 'linkedin' | 'website' | 'x' | 'youtube' | 'facebook' | 'github' | 'location' | 'custom';
  label: string;
  url: string;
  icon?: string;
  position: number;
  enabled: boolean;
}

export interface ContactSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  bookingUrl: string;
  address: string;
  notes: string;
  updatedAt: string;
  secondaryLinks: SecondaryLink[];
}

export interface AnalyticsEvent {
  id: string;
  event: 'contact_page_view' | 'contact_call_click' | 'contact_whatsapp_click' | 'contact_email_click' | 'contact_booking_click' | 'contact_social_click' | 'contact_vcard_download';
  source?: string;
  target?: string;
  timestamp: string;
  userAgent?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalCalls: number;
  totalWhatsApp: number;
  totalEmails: number;
  totalBookings: number;
  totalVcards: number;
  totalSocialClicks: number;
  sourceBreakdown: Record<string, number>;
  dailyViews: Record<string, number>;
  events: AnalyticsEvent[];
}
