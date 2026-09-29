import { NextResponse } from 'next/server';
import { getContactSettings } from '@/lib/storage';
import { generateVCard } from '@/lib/vcard';

export async function GET() {
  const settings = getContactSettings();
  const vcardContent = generateVCard(settings);
  const fileName = `${settings.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Contact.vcf`;

  return new NextResponse(vcardContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
