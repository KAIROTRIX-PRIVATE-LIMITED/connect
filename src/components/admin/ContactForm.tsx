'use client';

import React from 'react';
import { ContactSettings } from '@/lib/types';
import { Building2, Phone, MessageCircle, Mail, Globe, Calendar, MapPin, FileText } from 'lucide-react';

interface ContactFormProps {
  settings: ContactSettings;
  onChange: (updated: ContactSettings) => void;
}

export function ContactForm({ settings, onChange }: ContactFormProps) {
  const handleChange = (field: keyof ContactSettings, value: string) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 pb-2 border-b border-gray-100 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-purple-600" />
        Core Contact Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={settings.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="KAIROTRIX"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tagline
          </label>
          <input
            type="text"
            value={settings.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="BUILT TO EVOLVE"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-purple-600" />
            Phone Number (tel:)
          </label>
          <input
            type="text"
            value={settings.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="+1 (800) 555-0199"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Number
          </label>
          <input
            type="text"
            value={settings.whatsapp || ''}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="+1 (800) 555-0199"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            Email Address
          </label>
          <input
            type="email"
            value={settings.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="connect@kairotrix.com"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            Website URL
          </label>
          <input
            type="url"
            value={settings.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="https://kairotrix.com"
          />
        </div>

        {/* Booking URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Book a Meeting URL (Cal.com / Calendly / Custom link)
          </label>
          <input
            type="url"
            value={settings.bookingUrl || ''}
            onChange={(e) => handleChange('bookingUrl', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="https://kairotrix.com/book (Leave blank to hide button)"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            Office Address
          </label>
          <input
            type="text"
            value={settings.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="San Francisco, CA, United States"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            Contact Notes (Included in vCard)
          </label>
          <input
            type="text"
            value={settings.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-xs text-gray-900 outline-none"
            placeholder="Enterprise AI Solutions"
          />
        </div>
      </div>
    </div>
  );
}
