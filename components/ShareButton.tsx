'use client';

import { useState } from 'react';
import { trackGA4 } from '@/lib/analytics';

interface ShareButtonProps {
  tool: string;
  shape?: string;
  season?: string;
  bodyType?: string;
  /** Shared link text. Falls back to a generic line. */
  title?: string;
  className?: string;
}

const ShareIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function ShareButton({
  tool,
  shape,
  season,
  bodyType,
  title,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = title ?? 'Check out my result on FaceShapeAI';
    const fire = () =>
      trackGA4('share_result', { tool, shape, season, body_type: bodyType });

    try {
      if (navigator.share) {
        await navigator.share({ title: text, url });
        fire(); // success only — user cancel throws and is caught below
        return;
      }
    } catch {
      // user cancelled the native share sheet → do not track, do not fall back
      return;
    }

    // no native share (e.g. desktop) → copy link to clipboard
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        fire();
      }
    } catch {
      /* clipboard blocked — nothing actionable */
    }
  };

  return (
    <button
      type="button"
      className={className ?? 'btn-secondary'}
      onClick={onShare}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      {ShareIcon}
      <span>{copied ? 'Link copied!' : 'Share'}</span>
    </button>
  );
}
