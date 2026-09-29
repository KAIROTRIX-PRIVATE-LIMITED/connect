'use client';

import React from 'react';
import { Phone, MessageCircle, Mail, Globe, Calendar, ArrowUpRight } from 'lucide-react';
import { ContactSettings } from '@/lib/types';

interface PrimaryContactActionsProps {
  settings: ContactSettings;
  onActionClick: (actionType: string) => void;
}

export function PrimaryContactActions({
  settings,
  onActionClick,
}: PrimaryContactActionsProps) {
  const handleBooking = () => {
    onActionClick('booking');
    if (settings.bookingUrl) {
      window.open(settings.bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCall = () => {
    onActionClick('call');
    if (settings.phone) {
      window.location.href = `tel:${settings.phone}`;
    }
  };

  const handleWhatsApp = () => {
    onActionClick('whatsapp');
    const whatsappNum = settings.whatsapp || '';
    const cleanNumber = whatsappNum.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    onActionClick('email');
    if (settings.email) {
      window.location.href = `mailto:${settings.email}`;
    }
  };

  const handleWebsite = () => {
    onActionClick('website');
    if (settings.website) {
      const url = settings.website.startsWith('http') ? settings.website : `https://${settings.website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const showBooking = settings.showBookingBtn !== false && Boolean(settings.bookingUrl);

  const activeWhatsapp = settings.whatsapp;

  return (
    <div className="w-full space-y-3 my-2">
      {/* Primary Hero CTA: Book Meeting */}
      {showBooking && (
        <button
          onClick={handleBooking}
          className="relative w-full group overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-0.5 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {/* Shimmer animation bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <div className="relative flex items-center justify-between px-5 py-4 rounded-[14px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold tracking-wider uppercase text-purple-200">
                  Direct Schedule
                </span>
                <span className="block text-base font-bold tracking-tight">
                  Book a Discovery Call
                </span>
              </div>
            </div>
            
            <div className="p-2 rounded-full bg-white/15 group-hover:bg-white group-hover:text-purple-600 transition-colors duration-300">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </button>
      )}

      {/* Auto-adjusting Flex Grid for Direct Actions */}
      <div className="flex flex-wrap gap-2.5 w-full">
        {/* Call */}
        {settings.phone && (
          <button
            onClick={handleCall}
            className="flex-1 min-w-[90px] group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="w-9 h-9 mb-1.5 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
              Call
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
              {settings.phone}
            </span>
          </button>
        )}

        {/* WhatsApp */}
        {activeWhatsapp && (
          <button
            onClick={handleWhatsApp}
            className="flex-1 min-w-[90px] group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="w-9 h-9 mb-1.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              WhatsApp
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
              Chat Now
            </span>
          </button>
        )}

        {/* Email */}
        {settings.email && (
          <button
            onClick={handleEmail}
            className="flex-1 min-w-[90px] group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="w-9 h-9 mb-1.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
              Email
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
              Send Mail
            </span>
          </button>
        )}

        {/* Website (3rd or 4th Action) */}
        {settings.website && (
          <button
            onClick={handleWebsite}
            className="flex-1 min-w-[90px] group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="w-9 h-9 mb-1.5 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
              Website
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
              Visit Site
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
