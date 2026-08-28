'use client';

import LandmarkTool from '@/components/LandmarkTool';
import { classifyEye, EYE_TIPS, EYE_ORDER } from '@/lib/eyeShapes';

export default function EyeTool() {
  return (
    <LandmarkTool
      tool="eye"
      title="Eye Shape Detector — Live Camera"
      subhead="Open your camera and see your eye shape, canthal tilt and setting in real time — no photo upload, no sign-up."
      ctaText="Open Camera & Detect"
      landmarkNote="478 landmarks"
      classify={classifyEye}
      matchItems={EYE_ORDER}
      resultHeading="Your eye shape, the instant you detect"
      renderTips={(result) => (
        <div className="restips">
          <div className="rtip">
            <span className="ico">💄</span>
            <span>{EYE_TIPS[result.name].makeup}</span>
          </div>
        </div>
      )}
    />
  );
}
