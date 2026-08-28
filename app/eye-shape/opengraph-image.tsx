import { makeOgImage } from '@/lib/ogCard';

export const runtime = 'edge';
export const alt = 'Eye Shape Detector — find your eye shape from a live camera, free and private';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return makeOgImage({
    title: 'Find Your Eye Shape Instantly',
    subtitle: 'Free · Live camera · No photo upload · 100% private',
    chips: ['Almond', 'Round', 'Hooded', 'Monolid', 'Upturned', 'Downturned'],
  });
}
