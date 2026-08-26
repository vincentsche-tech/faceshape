import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { FACE_SHAPE_ORDER } from '@/lib/faceShapes';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/eye-shape`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/nose-shape`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/color-analysis`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/body-shape`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/vs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const shapes: MetadataRoute.Sitemap = FACE_SHAPE_ORDER.map((s) => ({
    url: `${SITE.url}/face-shapes/${s}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...base, ...shapes];
}
