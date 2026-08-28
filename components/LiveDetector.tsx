'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Adsense from '@/components/Adsense';
import { trackGA4 } from '@/lib/analytics';
import { FACE_SHAPES } from '@/lib/faceShapes';

const SHAPES = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond', 'Triangle'];

// 结果卡交付化：检测完直接给发型/眼镜/妆容建议预览，引导进完整指南
const SHAPE_TIPS: Record<string, { hair: string; glasses: string; makeup: string }> = {
  Oval: { hair: 'Long layers, side-swept bangs', glasses: 'Most frames suit you — try round & oval', makeup: 'Soft contour, lifted cheekbone' },
  Round: { hair: 'Long layers, volume at crown', glasses: 'Angular & rectangular frames', makeup: 'Contour sides, highlight center' },
  Square: { hair: 'Soft waves, side part', glasses: 'Round & oval frames soften edges', makeup: 'Blend the jawline contour' },
  Heart: { hair: 'Chin-length, side bangs', glasses: 'Bottom-heavy frames balance you', makeup: 'Warm cheeks, soft brows' },
  Oblong: { hair: 'Curtain bangs, volume at sides', glasses: 'Wide round frames', makeup: 'Horizontal cheek highlight' },
  Diamond: { hair: 'Textured layers, light fringe', glasses: 'Oval & rimless frames', makeup: 'Highlight the cheekbones' },
  Triangle: { hair: 'Volume at crown, soft layers', glasses: 'Cat-eye & aviator frames', makeup: 'Brighten the upper face' },
};
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm';

type Result = { name: string; conf: number } | null;

function dist(a: any, b: any) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Prototype-level heuristic from 478 landmarks.
function classify(lm: any): { name: string; conf: number } {
  const faceW = dist(lm[234], lm[454]);
  const faceH = dist(lm[10], lm[152]);
  const jawW = dist(lm[132], lm[361]);
  const foreW = dist(lm[21], lm[251]);
  const cheekW = dist(lm[127], lm[356]);
  const ratio = faceW / faceH;
  const jawRatio = jawW / faceW;
  const foreRatio = foreW / faceW;

  let name: string, conf: number;
  if (ratio > 0.82 && jawRatio > 0.92) {
    name = 'Square';
    conf = 88;
  } else if (ratio > 0.82 && foreRatio > 1.02) {
    name = 'Heart';
    conf = 86;
  } else if (ratio > 0.8) {
    name = 'Round';
    conf = 90;
  } else if (ratio < 0.66) {
    name = 'Oblong';
    conf = 89;
  } else if (cheekW > jawW * 1.12 && foreRatio < 0.96) {
    name = 'Diamond';
    conf = 84;
  } else if (jawRatio < 0.8 && foreRatio > 1.0) {
    name = 'Triangle';
    conf = 83;
  } else {
    name = 'Oval';
    conf = 92;
  }
  return { name, conf };
}

function describeError(e: unknown): string {
  if (typeof window === 'undefined') return 'Camera unavailable';
  if (!e || typeof e !== 'object') return 'Camera unavailable';
  const err = e as { name?: string; message?: string };
  const name = err.name || '';
  const msg = (err.message || '').slice(0, 140);
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera blocked. Click the camera icon in the address bar and choose Allow, then retry.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No webcam found. Plug one in, or use Upload photo instead.';
    case 'NotReadableError':
      return 'Webcam is busy in another app. Close Zoom/Meet/etc and retry.';
    case 'AbortError':
      return 'Camera start was cancelled. Click Enable Camera again.';
    default:
      if (msg) return `Model / camera failed: ${name || 'Error'} — ${msg}`;
      return 'Model / camera failed. Check connection and retry, or use Upload photo.';
  }
}

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

export default function LiveDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoLMRef = useRef<any>(null);
  const imageLMRef = useRef<any>(null);
  const streamingRef = useRef(false);
  const lastTRef = useRef(0);
  const lastFaceSeenRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reportedRef = useRef<string | null>(null);

  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [camState, setCamState] = useState<'idle' | 'loading' | 'detecting' | 'live' | 'error'>('idle');
  const [label, setLabel] = useState('Your face shape appears here in real time');
  const [errMsg, setErrMsg] = useState<string>('');
  const [result, setResult] = useState<Result>(null);

  const initVideoModel = useCallback(async () => {
    if (videoLMRef.current) return;
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(WASM);
    try {
      videoLMRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
    } catch {
      videoLMRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
    }
  }, []);

  const initImageModel = useCallback(async () => {
    if (imageLMRef.current) return;
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(WASM);
    imageLMRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL, delegate: 'GPU' },
      runningMode: 'IMAGE',
      numFaces: 1,
    });
  }, []);

  const detectLoop = useCallback(
    (t: number) => {
      if (!streamingRef.current) return;
      const video = videoRef.current;
      const overlay = overlayRef.current;
      if (video && overlay && video.readyState >= 2 && t - lastTRef.current > 60) {
        lastTRef.current = t;
        try {
          const res = videoLMRef.current.detectForVideo(video, t);
          const octx = overlay.getContext('2d');
          if (!octx) return;
          octx.clearRect(0, 0, overlay.width, overlay.height);
          if (res.faceLandmarks && res.faceLandmarks.length) {
            const lm = res.faceLandmarks[0];
            lastFaceSeenRef.current = t;
            octx.fillStyle = 'rgba(109,93,252,0.9)';
            for (const p of lm) {
              const x = p.x * overlay.width;
              const y = p.y * overlay.height;
              octx.beginPath();
              octx.arc(x, y, 1.5, 0, Math.PI * 2);
              octx.fill();
            }
            const r = classify(lm);
            setResult(r);
            if (r.name !== reportedRef.current) {
              reportedRef.current = r.name;
              trackGA4('tool_complete', { tool: 'face', shape: r.name, confidence: r.conf });
            }
            setCamState('live');
            setLabel('Live — your shape updates as you move');
          } else if (t - lastFaceSeenRef.current > 5000) {
            setLabel('No face detected — center your face or switch to Upload');
          }
        } catch {
          /* single frame error, keep loop */
        }
      }
      rafRef.current = requestAnimationFrame(detectLoop);
    },
    [],
  );

  const startCamera = useCallback(async () => {
    setMode('camera');
    setErrMsg('');
    reportedRef.current = null;
    trackGA4('tool_start', { tool: 'face' });
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setCamState('error');
      setErrMsg('Camera requires HTTPS or localhost. Open the https:// link.');
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCamState('error');
      setErrMsg('Your browser does not support camera access. Try Chrome or Edge, or use Upload photo.');
      return;
    }
    setCamState('loading');
    setLabel('Loading model (~5 MB) — first time only');
    try {
      await initVideoModel();
      setLabel('Allow the camera in your browser');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      await video.play();
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.width = video.videoWidth || 640;
        overlay.height = video.videoHeight || 480;
      }
      streamingRef.current = true;
      lastFaceSeenRef.current = performance.now();
      setCamState('detecting');
      setLabel('Detecting…');
      rafRef.current = requestAnimationFrame(detectLoop);
    } catch (e) {
      setCamState('error');
      setErrMsg(describeError(e));
      setLabel('Camera unavailable');
      // eslint-disable-next-line no-console
      console.error('[FaceShape] camera error:', e);
    }
  }, [detectLoop, initVideoModel]);

  const switchMode = useCallback((m: 'camera' | 'upload') => {
    setMode(m);
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (m === 'camera') {
      setLabel('Your face shape appears here in real time');
    } else {
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
      streamingRef.current = false;
      if (overlay) overlay.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height);
      setCamState('idle');
      setLabel('Upload a photo to detect your shape');
    }
  }, []);

  const handleFile = useCallback(
    async (file?: File) => {
      if (!file) return;
      setCamState('idle');
      setErrMsg('');
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = async () => {
        try {
          await initImageModel();
          const cvs = overlayRef.current;
          if (!cvs) return;
          cvs.width = 440;
          cvs.height = 440;
          const octx = cvs.getContext('2d');
          if (!octx) return;
          const scale = Math.max(440 / img.width, 440 / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          const dx = (440 - dw) / 2;
          const dy = (440 - dh) / 2;
          octx.clearRect(0, 0, 440, 440);
          octx.drawImage(img, dx, dy, dw, dh);
          const res = imageLMRef.current.detect(img);
          if (res.faceLandmarks && res.faceLandmarks.length) {
            const lm = res.faceLandmarks[0];
            octx.fillStyle = 'rgba(109,93,252,0.95)';
            for (const p of lm) {
              const x = p.x * img.width * scale + dx;
              const y = p.y * img.height * scale + dy;
              octx.beginPath();
              octx.arc(x, y, 2, 0, Math.PI * 2);
              octx.fill();
            }
            const r = classify(lm);
            setResult(r);
            if (r.name !== reportedRef.current) {
              reportedRef.current = r.name;
              trackGA4('tool_complete', { tool: 'face', shape: r.name, confidence: r.conf });
            }
            setCamState('live');
            setLabel('Detected from your photo');
          } else {
            setLabel('No face found — try a clearer, front-facing photo');
          }
        } catch (e) {
          setErrMsg(describeError(e));
          // eslint-disable-next-line no-console
          console.error('[FaceShape] upload error:', e);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => {
        setLabel('Could not read that image');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [initImageModel],
  );

  useEffect(() => {
    return () => {
      streamingRef.current = false;
      cancelAnimationFrame(rafRef.current);
      const video = videoRef.current;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const slug = result ? result.name.toLowerCase() : '';
  // 结果卡发型建议铺风格标签：合并该脸型男女建议的风格词（去重），与承接页一致
  const styleTags = result
    ? Array.from(
        new Set([
          ...FACE_SHAPES[slug].hairStyleMen.flat(),
          ...FACE_SHAPES[slug].hairStyleWomen.flat(),
        ]),
      )
    : [];
  const isLoading = camState === 'loading' || camState === 'detecting';

  return (
    <>
      <section className="hero" id="detect">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="hero-left">
            <h1>Face Shape Detector Online Camera</h1>
            <p className="subhead">
              Turn on your webcam and watch your face shape appear in real time — no photo to upload, no account needed.
            </p>
            <div className="ctarow">
              <button type="button" className="btn-primary" onClick={startCamera} disabled={isLoading}>
                {camState === 'loading' ? 'Loading model…' : 'Open Camera & Detect'}
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
                {UserIcon}478 Landmarks
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
                onClick={startCamera}
                disabled={isLoading}
                style={{
                  display: mode === 'camera' && camState !== 'live' ? 'block' : 'none',
                }}
              >
                {camState === 'loading' ? 'Loading model…' : 'Enable Camera'}
              </button>
              <div
                className="cam-error"
                role="alert"
                style={{ display: camState === 'error' ? 'flex' : 'none' }}
              >
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
                aria-label="Upload a photo to detect your face shape"
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
          <h2>Your result, the instant you detect</h2>
            <div className="resultcard" aria-live="polite">
              <div className="rshape">{result ? result.name : '—'}</div>
              <div className="rconf">
                {result
                  ? `${result.conf}% confidence · 478 landmarks ${
                      mode === 'camera' ? 'from live camera' : 'from your photo'
                    }`
                  : 'Open your camera or upload a photo to see your face shape and confidence.'}
              </div>
              {result && (
                <div className="restips">
                  <div className="rtip">
                    <span className="rico">💇</span>
                    <div className="rtip-body">
                      <span className="rtip-txt">{SHAPE_TIPS[result.name].hair}</span>
                      <div className="rstyletags">
                        {styleTags.map((t) => (
                          <span className={`hstyle ${/^avoid/i.test(t) ? 'avoid' : ''}`} key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rtip">
                    <span className="ico">👓</span>
                    <span>{SHAPE_TIPS[result.name].glasses}</span>
                  </div>
                  <div className="rtip">
                    <span className="ico">💄</span>
                    <span>{SHAPE_TIPS[result.name].makeup}</span>
                  </div>
                </div>
              )}
              {result && (
                <a className="fullguide" href={`/face-shapes/${slug}`}>
                  View full guide →
                </a>
              )}
            </div>
          <div className="matchbar">
            {SHAPES.map((s) => (
              <span key={s} className={result && result.name === s ? 'on' : ''}>
                {s}
              </span>
            ))}
          </div>
          <Adsense slot="result" />
        </div>
      </section>
    </>
  );
}
