import { ContactSettings } from './types';

export function generateVCard(settings: ContactSettings): string {
  const company = settings.companyName || 'KAIROTRIX';
  const cleanPhone = settings.phone ? settings.phone.replace(/[^\d+]/g, '') : '';
  const cleanWhatsApp = settings.whatsapp ? settings.whatsapp.replace(/[^\d+]/g, '') : '';
  
  const notesLines = [];
  if (settings.tagline) notesLines.push(settings.tagline);
  if (settings.notes) notesLines.push(settings.notes);
  if (settings.bookingUrl) notesLines.push(`Book Meeting: ${settings.bookingUrl}`);
  
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${company}`,
    `N:;${company};;;`,
    `ORG:${company}`,
    `TITLE:${settings.tagline || 'Contact Card'}`,
  ];

  if (settings.phone) {
    vcardLines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone || settings.phone}`);
  }

  if (settings.whatsapp && settings.whatsapp !== settings.phone) {
    vcardLines.push(`TEL;TYPE=WORK,VOICE:${cleanWhatsApp || settings.whatsapp}`);
  }

  if (settings.email) {
    vcardLines.push(`EMAIL;TYPE=INTERNET,WORK:${settings.email}`);
  }

  if (settings.website) {
    vcardLines.push(`URL;TYPE=WORK:${settings.website}`);
  }

  if (settings.address) {
    vcardLines.push(`ADR;TYPE=WORK:;;${settings.address};;;;`);
  }

  if (notesLines.length > 0) {
    // Escape newlines in note for vCard format
    const noteText = notesLines.join(' | ').replace(/\n/g, ' ');
    vcardLines.push(`NOTE:${noteText}`);
  }

  vcardLines.push(`REV:${new Date().toISOString()}`);
  vcardLines.push('END:VCARD');

  return vcardLines.join('\r\n');
}
