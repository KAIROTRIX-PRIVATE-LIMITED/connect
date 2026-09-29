'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, Sparkles, AlertCircle, Palette, CircleDot, Square, Circle } from 'lucide-react';
import { generateQrSvg, generateQrDataUrl, QrOptions } from '@/lib/qr';

type DotStyle = 'rounded' | 'dots' | 'square';
type FinderStyle = 'rounded' | 'square';

interface PresetTheme {
  name: string;
  darkColor: string;
  gradientColors: [string, string] | null;
  dotStyle: DotStyle;
  finderStyle: FinderStyle;
}

const PRESET_THEMES: PresetTheme[] = [
  {
    name: 'KAIROTRIX Purple',
    darkColor: '#7C3AED',
    gradientColors: ['#9333EA', '#6D28D9'],
    dotStyle: 'rounded',
    finderStyle: 'rounded',
  },
  {
    name: 'Obsidian',
    darkColor: '#18181B',
    gradientColors: null,
    dotStyle: 'rounded',
    finderStyle: 'rounded',
  },
  {
    name: 'Midnight',
    darkColor: '#1E1B4B',
    gradientColors: ['#312E81', '#1E1B4B'],
    dotStyle: 'dots',
    finderStyle: 'rounded',
  },
  {
    name: 'Carbon',
    darkColor: '#0F172A',
    gradientColors: ['#1E293B', '#0F172A'],
    dotStyle: 'rounded',
    finderStyle: 'rounded',
  },
];

export function QrStudio() {
  const [baseUrl, setBaseUrl] = useState('https://kairotrix.com/connect');
  const [campaignSrc, setCampaignSrc] = useState('');
  const [darkColor, setDarkColor] = useState('#7C3AED');
  const [dotStyle, setDotStyle] = useState<DotStyle>('rounded');
  const [finderStyle, setFinderStyle] = useState<FinderStyle>('rounded');
  const [gradientColors, setGradientColors] = useState<[string, string] | null>(['#9333EA', '#6D28D9']);
  const [qrSvg, setQrSvg] = useState('');
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  const fullTargetUrl = campaignSrc
    ? `${baseUrl}?src=${encodeURIComponent(campaignSrc)}`
    : baseUrl;

  const qrOptions: QrOptions = {
    darkColor,
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'H',
    margin: 2,
    dotStyle,
    finderStyle,
    logoSizeRatio: 0.22,
    gradientColors,
  };

  useEffect(() => {
    generateQrSvg(fullTargetUrl, qrOptions).then(setQrSvg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullTargetUrl, darkColor, dotStyle, finderStyle, gradientColors]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (index: number) => {
    const preset = PRESET_THEMES[index];
    setDarkColor(preset.darkColor);
    setGradientColors(preset.gradientColors);
    setDotStyle(preset.dotStyle);
    setFinderStyle(preset.finderStyle);
    setActivePreset(index);
  };

  const handleDownloadSvg = () => {
    // For SVG download, overlay the logo image inside the SVG
    const logoUrl = '/logo/SYMBOL/KAIROTRIX_Symbol_Black.png';
    
    // Fetch the logo and embed it as base64 into the SVG
    fetch(logoUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Parse the SVG to inject the logo
          const parser = new DOMParser();
          const doc = parser.parseFromString(qrSvg, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (!svgEl) return;

          const viewBox = svgEl.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 100, 100];
          const totalSize = viewBox[2];
          const logoSize = totalSize * 0.22 * 0.75;
          const logoX = (totalSize - logoSize) / 2;
          const logoY = (totalSize - logoSize) / 2;

          const imageEl = doc.createElementNS('http://www.w3.org/2000/svg', 'image');
          imageEl.setAttribute('x', String(logoX));
          imageEl.setAttribute('y', String(logoY));
          imageEl.setAttribute('width', String(logoSize));
          imageEl.setAttribute('height', String(logoSize));
          imageEl.setAttribute('href', base64);
          svgEl.appendChild(imageEl);

          const serializer = new XMLSerializer();
          const svgWithLogo = serializer.serializeToString(doc);
          
          const downloadBlob = new Blob([svgWithLogo], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(downloadBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `KAIROTRIX-QR-${campaignSrc || 'connect'}.svg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Fallback: download SVG without embedded logo
        const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KAIROTRIX-QR-${campaignSrc || 'connect'}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };

  const handleDownloadPng = async (dimension: number, label: string) => {
    const dataUrl = await generateQrDataUrl(fullTargetUrl, {
      ...qrOptions,
      width: dimension,
    });

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `KAIROTRIX-QR-${campaignSrc || 'connect'}-${label}-${dimension}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const dotStyleIcon = (style: DotStyle) => {
    switch (style) {
      case 'dots': return <CircleDot className="w-3.5 h-3.5" />;
      case 'rounded': return <Circle className="w-3.5 h-3.5" />;
      case 'square': return <Square className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 md:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-600" />
            KAIROTRIX QR Code Asset Studio
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Generate premium, branded QR codes with your K logo embedded.
          </p>
        </div>
        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Branded
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Controls */}
        <div className="space-y-5">
          {/* URL Config */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Permanent QR Target URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-900 focus:border-purple-600 outline-none transition-colors"
                placeholder="https://kairotrix.com/connect"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Campaign Tag */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Campaign Tag <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">?src=</code>
            </label>
            <input
              type="text"
              value={campaignSrc}
              onChange={(e) => setCampaignSrc(e.target.value)}
              placeholder="e.g. poster, brochure, businesscard"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-900 focus:border-purple-600 outline-none transition-colors"
            />
          </div>

          {/* Style Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              Style Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((theme, i) => (
                <button
                  key={theme.name}
                  onClick={() => applyPreset(i)}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activePreset === i
                      ? 'border-purple-300 bg-purple-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-md shrink-0 shadow-sm"
                    style={{
                      background: theme.gradientColors
                        ? `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})`
                        : theme.darkColor,
                    }}
                  />
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">
                    {theme.name}
                  </span>
                  {activePreset === i && (
                    <div className="absolute top-1 right-1">
                      <Check className="w-3 h-3 text-purple-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dot Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Module Shape
            </label>
            <div className="flex gap-1.5">
              {(['rounded', 'dots', 'square'] as DotStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setDotStyle(style)}
                  className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    dotStyle === style
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dotStyleIcon(style)}
                  <span className="capitalize">{style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Finder Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Finder Pattern
            </label>
            <div className="flex gap-1.5">
              {(['rounded', 'square'] as FinderStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setFinderStyle(style)}
                  className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    finderStyle === style
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {style === 'rounded' ? <Circle className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  <span className="capitalize">{style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Override */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Custom Foreground
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => {
                  setDarkColor(e.target.value);
                  setGradientColors(null);
                  setActivePreset(-1);
                }}
                className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
              />
              <span className="text-[11px] font-mono text-gray-500">{darkColor}</span>
            </div>
          </div>

          {/* Print Info */}
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Print Guarantee:</strong> Level H error correction + center logo zone ensures reliable scanning on all surfaces. The K logo is automatically embedded in every export.
            </div>
          </div>
        </div>

        {/* Right Column: QR Preview & Downloads */}
        <div className="flex flex-col items-center">
          {/* QR Preview Card */}
          <div className="w-full bg-gradient-to-br from-gray-50 via-white to-purple-50/30 border border-gray-200/80 rounded-2xl p-6 text-center">
            {/* QR Code Container with Logo Overlay */}
            <div className="relative mx-auto max-w-[260px] w-full mb-5">
              <div
                className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_-4px_rgba(147,51,234,0.12)] border border-purple-100/60 aspect-square flex items-center justify-center"
              >
                {qrSvg ? (
                  <div className="w-full h-full relative">
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />
                    {/* Logo overlay in center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img
                        src="/logo/SYMBOL/KAIROTRIX_Symbol_Black.png"
                        alt="K"
                        className="w-[16%] h-[16%] object-contain"
                        style={{ imageRendering: 'auto' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                    <span className="text-xs text-gray-400">Generating...</span>
                  </div>
                )}
              </div>
            </div>

            {/* URL Display */}
            <div className="mb-5">
              <span className="block text-xs font-bold text-gray-800 truncate max-w-[280px] mx-auto font-mono">
                {fullTargetUrl}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                Scans to your permanent contact card
              </span>
            </div>

            {/* Export Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadSvg}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Vector SVG (Print & Design)
              </button>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleDownloadPng(1000, 'business-cards')}
                  className="py-2.5 px-2 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm text-gray-700 hover:text-purple-700 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Cards (1000px)
                </button>
                <button
                  onClick={() => handleDownloadPng(2000, 'social-graphics')}
                  className="py-2.5 px-2 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm text-gray-700 hover:text-purple-700 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Social (2000px)
                </button>
                <button
                  onClick={() => handleDownloadPng(4000, 'poster-print')}
                  className="py-2.5 px-2 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm text-gray-700 hover:text-purple-700 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Print (4000px)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
