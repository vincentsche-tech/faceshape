import { makeOgImage } from '@/lib/ogCard';

export const runtime = 'edge';
export const alt = 'Nose Shape Detector — find your nose shape from a live camera, free and private';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return makeOgImage({
    title: "What's Your Nose Shape?",
    subtitle: 'Free · Live camera · No photo upload · 100% private',
    chips: ['Straight', 'Roman', 'Nubian', 'Hawk', 'Button', 'Greek'],
  });
}
