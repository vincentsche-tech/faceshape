'use client';

import LandmarkTool from '@/components/LandmarkTool';
import { classifyNose, NOSE_TIPS, NOSE_ORDER } from '@/lib/noseShapes';

export default function NoseTool() {
  return (
    <LandmarkTool
      tool="nose"
      title="Nose Shape Detector — Live Camera"
      subhead="Map your nose width and length proportions live in your browser — no photo upload, no sign-up."
      ctaText="Open Camera & Detect"
      landmarkNote="478 landmarks"
      classify={classifyNose}
      matchItems={NOSE_ORDER}
      resultHeading="Your nose structure, the instant you detect"
      renderTips={(result) => (
        <div className="restips">
          <div className="rtip">
            <span className="ico">💄</span>
            <span>{NOSE_TIPS[result.name].contour}</span>
          </div>
        </div>
      )}
    />
  );
}
