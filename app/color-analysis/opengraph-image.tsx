import { makeOgImage } from '@/lib/ogCard';

export const runtime = 'edge';
export const alt = 'Color Analysis Quiz — find your color season and best palette, free';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return makeOgImage({
    title: 'Find Your Color Season',
    subtitle: 'Free · 2-minute quiz · Your best palette & makeup',
    chips: ['Spring', 'Summer', 'Autumn', 'Winter'],
  });
}
