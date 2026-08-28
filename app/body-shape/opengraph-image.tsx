import { makeOgImage } from '@/lib/ogCard';

export const runtime = 'edge';
export const alt = 'Body Shape Calculator — measure at home and discover your body shape, free';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return makeOgImage({
    title: 'Discover Your Body Shape',
    subtitle: 'Free · Measure at home · No app · Instant result',
    chips: ['Pear', 'Apple', 'Hourglass', 'Rectangle', 'Inverted Triangle'],
  });
}
