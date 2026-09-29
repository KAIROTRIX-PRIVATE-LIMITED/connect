'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsSummary } from '@/lib/types';
import { BarChart3, Eye, Phone, MessageCircle, Mail, Calendar, UserPlus, Share2, RefreshCw } from 'lucide-react';

interface AnalyticsOverviewProps {
  token: string;
}

export function AnalyticsOverview({ token }: AnalyticsOverviewProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-gray-500 font-mono">
        Loading scan analytics data...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6 text-center text-xs text-gray-500">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Contact Scan & Action Analytics
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Privacy-friendly engagement metrics recorded from QR scans and contact interactions.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Page Views */}
        <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-100">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Views</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalViews}</span>
        </div>

        {/* Calls */}
        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">Calls</span>
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalCalls}</span>
        </div>

        {/* WhatsApp */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">WhatsApp</span>
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalWhatsApp}</span>
        </div>

        {/* Emails */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">Emails</span>
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalEmails}</span>
        </div>

        {/* Bookings */}
        <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-100">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">Meetings</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalBookings}</span>
        </div>

        {/* vCards */}
        <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-100">
          <div className="flex items-center justify-between text-pink-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">vCards Saved</span>
            <UserPlus className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalVcards}</span>
        </div>

        {/* Social Clicks */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[11px] font-semibold uppercase">Social Clicks</span>
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold text-gray-900">{summary.totalSocialClicks}</span>
        </div>
      </div>

      {/* Campaign / Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-white border border-gray-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
            Traffic Origin / Campaign Breakdown (?src=)
          </h4>
          {Object.keys(summary.sourceBreakdown).length === 0 ? (
            <p className="text-xs text-gray-400">No source data logged yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(summary.sourceBreakdown).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {source}
                  </span>
                  <span className="font-semibold text-gray-800">{count} events</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Events Table */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
            Recent Engagement Log
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {summary.events.slice(0, 15).map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-gray-50 text-gray-700"
              >
                <span className="font-semibold text-purple-700">{evt.event}</span>
                <span className="text-gray-400 font-mono">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
