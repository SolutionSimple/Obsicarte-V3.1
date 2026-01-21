import type { Profile } from '../types/database.types';

export function generateVCard(profile: Profile): string {
  const vcard: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.full_name}`,
  ];

  if (profile.title) {
    vcard.push(`TITLE:${profile.title}`);
  }

  if (profile.phone) {
    vcard.push(`TEL;TYPE=CELL:${profile.phone}`);
  }

  if (profile.email) {
    vcard.push(`EMAIL:${profile.email}`);
  }

  if (profile.website) {
    vcard.push(`URL:${profile.website}`);
  }

  if (profile.bio) {
    vcard.push(`NOTE:${profile.bio.replace(/\n/g, '\\n')}`);
  }

  if (profile.social_links) {
    if (profile.social_links.linkedin) {
      vcard.push(`X-SOCIALPROFILE;TYPE=linkedin:${profile.social_links.linkedin}`);
    }
    if (profile.social_links.twitter) {
      vcard.push(`X-SOCIALPROFILE;TYPE=twitter:${profile.social_links.twitter}`);
    }
    if (profile.social_links.instagram) {
      vcard.push(`X-SOCIALPROFILE;TYPE=instagram:${profile.social_links.instagram}`);
    }
    if (profile.social_links.facebook) {
      vcard.push(`X-SOCIALPROFILE;TYPE=facebook:${profile.social_links.facebook}`);
    }
  }

  vcard.push('END:VCARD');

  return vcard.join('\r\n');
}

export function downloadVCard(profile: Profile): void {
  const vcardContent = generateVCard(profile);
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${profile.username || 'contact'}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
