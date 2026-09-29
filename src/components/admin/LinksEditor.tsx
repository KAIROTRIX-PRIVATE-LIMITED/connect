'use client';

import React from 'react';
import { SecondaryLink } from '@/lib/types';
import { Share2, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface LinksEditorProps {
  links: SecondaryLink[];
  onChange: (updatedLinks: SecondaryLink[]) => void;
}

export function LinksEditor({ links = [], onChange }: LinksEditorProps) {
  const handleToggle = (id: string) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    );
    onChange(updated);
  };

  const handleUpdate = (id: string, field: keyof SecondaryLink, value: any) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = links.filter((link) => link.id !== id);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === links.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // update position property
    const reordered = newLinks.map((link, idx) => ({ ...link, position: idx + 1 }));
    onChange(reordered);
  };

  const handleAddLink = () => {
    const newLink: SecondaryLink = {
      id: `link-${Date.now()}`,
      type: 'custom',
      label: 'New Contact Link',
      url: 'https://',
      position: links.length + 1,
      enabled: true,
    };
    onChange([...links, newLink]);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-600" />
          Secondary & Social Links
        </h3>
        <button
          type="button"
          onClick={handleAddLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Link
        </button>
      </div>

      <div className="space-y-2.5">
        {links.map((link, index) => (
          <div
            key={link.id}
            className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center gap-2.5 ${
              link.enabled
                ? 'bg-white border-gray-200 shadow-2xs'
                : 'bg-gray-50/70 border-gray-100 opacity-60'
            }`}
          >
            {/* Control buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="p-1 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 'down')}
                disabled={index === links.length - 1}
                className="p-1 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Type selector */}
            <select
              value={link.type}
              onChange={(e) => handleUpdate(link.id, 'type', e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-800 focus:border-purple-600 outline-none bg-white"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="website">Website</option>
              <option value="x">X / Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="github">GitHub</option>
              <option value="location">Location</option>
              <option value="custom">Custom Link</option>
            </select>

            {/* Label input */}
            <input
              type="text"
              value={link.label}
              onChange={(e) => handleUpdate(link.id, 'label', e.target.value)}
              placeholder="Button Label"
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900 focus:border-purple-600 outline-none"
            />

            {/* URL input */}
            <input
              type="url"
              value={link.url}
              onChange={(e) => handleUpdate(link.id, 'url', e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-900 focus:border-purple-600 outline-none"
            />

            {/* Actions: Enable Toggle & Delete */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => handleToggle(link.id)}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer ${
                  link.enabled
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {link.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(link.id)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
