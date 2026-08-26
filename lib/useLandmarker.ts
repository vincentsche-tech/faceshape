'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm';

export type CamState = 'idle' | 'loading' | 'detecting' | 'live' | 'error';

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

// 共享摄像头 + MediaPipe FaceLandmarker hook。
// 抽出自 LiveDetector，供 Eye / Nose 工具复用；Face 工具保持原样不碰。
// 返回原始 landmarks（归一化坐标数组），由调用方的 classify 函数决定输出。
export function useLandmarker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoLMRef = useRef<any>(null);
  const imageLMRef = useRef<any>(null);
  const streamingRef = useRef(false);
  const lastTRef = useRef(0);
  const lastFaceSeenRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [camState, setCamState] = useState<CamState>('idle');
  const [label, setLabel] = useState('Your result appears here in real time');
  const [errMsg, setErrMsg] = useState('');
  const [landmarks, setLandmarks] = useState<any>(null);

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

  const detectLoop = useCallback((t: number) => {
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
          setLandmarks(lm);
          setCamState('live');
          setLabel('Live — your result updates as you move');
        } else if (t - lastFaceSeenRef.current > 5000) {
          setLabel('No face detected — center your face or switch to Upload');
        }
      } catch {
        /* single frame error, keep loop */
      }
    }
    rafRef.current = requestAnimationFrame(detectLoop);
  }, []);

  const startCamera = useCallback(async () => {
    setMode('camera');
    setErrMsg('');
    setLandmarks(null);
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
      setLabel('Your result appears here in real time');
    } else {
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
      streamingRef.current = false;
      if (overlay) overlay.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height);
      setCamState('idle');
      setLabel('Upload a photo to detect your result');
    }
  }, []);

  const handleFile = useCallback(
    async (file?: File) => {
      if (!file) return;
      setCamState('idle');
      setErrMsg('');
      setLandmarks(null);
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
            setLandmarks(lm);
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

  const isLoading = camState === 'loading' || camState === 'detecting';

  return {
    videoRef,
    overlayRef,
    fileInputRef,
    mode,
    camState,
    label,
    errMsg,
    landmarks,
    startCamera,
    switchMode,
    handleFile,
    isLoading,
  };
}
