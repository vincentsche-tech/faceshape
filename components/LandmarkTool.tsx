'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Adsense from '@/components/Adsense';
import { useLandmarker } from '@/lib/useLandmarker';
import { trackGA4 } from '@/lib/analytics';
import ShareButton from '@/components/ShareButton';

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 19c1-3 3-4 5.5-4s4.5 1 5.5 4" />
  </svg>
);
const CpuIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 6h16v12H4z" />
    <path d="M4 10h16" />
  </svg>
);
const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V8a5 5 0 0 1 10 0v3" />
  </svg>
);

interface Props {
  tool: 'eye' | 'nose';
  title: string;
  subhead: string;
  ctaText?: string;
  landmarkNote?: string;
  classify: (lm: any) => { name: string; conf: number };
  renderTips: (result: { name: string; conf: number }, mode: 'camera' | 'upload') => ReactNode;
  guideHref?: (slug: string) => string;
  matchItems?: string[];
  resultHeading?: string;
}

// 通用摄像头检测外壳：复用 Face 工具的 hero / cammodel / resultcard 视觉系统，
// 仅 classify + 文案由具体工具(eye/nose)注入。Face 工具本身不依赖此组件，零回归。
export default function LandmarkTool({
  title,
  subhead,
  tool,
  ctaText = 'Open Camera & Detect',
  landmarkNote = '478 landmarks',
  classify,
  renderTips,
  guideHref,
  matchItems,
  resultHeading = 'Your result, the instant you detect',
}: Props) {
  const { videoRef, overlayRef, fileInputRef, mode, camState, label, errMsg, landmarks, startCamera, switchMode, handleFile, isLoading } =
    useLandmarker();

  const result = landmarks ? classify(landmarks) : null;
  const slug = result ? result.name.toLowerCase() : '';
  const reportedRef = useRef<string | null>(null);

  useEffect(() => {
    if (result && result.name !== reportedRef.current) {
      reportedRef.current = result.name;
      trackGA4('tool_complete', { tool, shape: result.name, confidence: result.conf });
    }
  }, [result, tool]);

  const handleStart = () => {
    trackGA4('tool_start', { tool });
    startCamera();
  };

  return (
    <>
      <section className="hero" id="detect">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="hero-left">
            <h1>{title}</h1>
            <p className="subhead">{subhead}</p>
            <div className="ctarow">
              <button type="button" className="btn-primary" onClick={handleStart} disabled={isLoading}>
                {camState === 'loading' ? 'Loading model…' : ctaText}
              </button>
              <a className="btn-secondary" href="#steps">
                How it works
              </a>
            </div>
            <div className="trustrow">
              <span className="trustbadge primary">
                {ShieldIcon}100% Private &amp; Secure
              </span>
              <span className="trustbadge">
                {UserIcon}
                {landmarkNote}
              </span>
              <span className="trustbadge">
                {CpuIcon}Local Processing
              </span>
              <span className="trustbadge">
                {LockIcon}Photo Never Leaves Device
              </span>
            </div>
          </div>

          <div className="cammodel">
            <div className="cam-topbar">
              <div className="cam-tabs">
                <button
                  type="button"
                  className={mode === 'camera' ? 'cam-tab active' : 'cam-tab'}
                  onClick={() => switchMode('camera')}
                >
                  Camera
                </button>
                <button
                  type="button"
                  className={mode === 'upload' ? 'cam-tab active' : 'cam-tab'}
                  onClick={() => switchMode('upload')}
                >
                  Upload photo
                </button>
              </div>
              <span className="cam-priv">{ShieldIcon}100% Private</span>
            </div>
            <div className="cam-hint" style={{ display: camState === 'live' ? 'block' : 'none' }}>
              ● LIVE
            </div>
            <div className="cam-inner">
              <video
                id="video"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ display: mode === 'camera' ? 'block' : 'none' }}
              />
              <canvas id="overlay" ref={overlayRef} />
              <button
                type="button"
                className="cam-cta"
                onClick={handleStart}
                disabled={isLoading}
                style={{ display: mode === 'camera' && camState !== 'live' ? 'block' : 'none' }}
              >
                {camState === 'loading' ? 'Loading model…' : 'Enable Camera'}
              </button>
              <div className="cam-error" role="alert" style={{ display: camState === 'error' ? 'flex' : 'none' }}>
                <div className="cam-error-msg">{errMsg || 'Camera unavailable. Try Upload photo instead.'}</div>
                <div className="cam-error-actions">
                  <button type="button" className="cam-cta cam-cta-small" onClick={() => switchMode('upload')}>
                    Use Upload photo
                  </button>
                  <button type="button" className="cam-cta cam-cta-small" onClick={startCamera}>
                    Retry
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="upload-drop"
                onClick={() => fileInputRef.current?.click()}
                style={{ display: mode === 'upload' ? 'flex' : 'none' }}
                aria-label="Upload a photo to detect"
              >
                <span className="ico">＋</span>
                <span className="ut">Drop a photo or click to upload</span>
                <span className="us">JPG / PNG · analyzed in your browser, never uploaded</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  aria-label="Choose a photo"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </button>
            </div>
            <div className="cam-label">{label}</div>
          </div>
        </div>
      </section>

      <section className="resultsec" id="result">
        <div className="wrap">
          <h2>{resultHeading}</h2>
          <div className="resultcard" aria-live="polite">
            <div className="rshape">{result ? result.name : '—'}</div>
            <div className="rconf">
              {result
                ? `${result.conf}% confidence · ${landmarkNote} ${mode === 'camera' ? 'from live camera' : 'from your photo'}`
                : 'Open your camera or upload a photo to see your result and confidence.'}
            </div>
            {result && renderTips(result, mode)}
            {result && guideHref && (
              <a className="fullguide" href={guideHref(slug)}>
                View full guide →
              </a>
            )}
            {result && (
              <ShareButton tool={tool} shape={slug} title={`My ${tool} shape is ${result.name}`} />
            )}
          </div>
          {matchItems && (
            <div className="matchbar">
              {matchItems.map((s) => (
                <span key={s} className={result && result.name === s ? 'on' : ''}>
                  {s}
                </span>
              ))}
            </div>
          )}
          <Adsense slot="result" />
        </div>
      </section>
    </>
  );
}
