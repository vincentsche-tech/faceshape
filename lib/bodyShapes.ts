// Body Shape（三围测量分类）—— 纯比例启发式，无 ML。
// 输入肩宽/腰围/臀围（同单位），输出 5 种经典体型之一。

export type BodyShapeName = 'Hourglass' | 'Pear' | 'Apple' | 'Rectangle' | 'Inverted Triangle';

export interface BodyShapeInfo {
  name: BodyShapeName;
  desc: string;
  svg: string; // 躯干轮廓 path，viewBox 0 0 200 240（头用 circle 单独画）
  wear: string[];
  avoid: string[];
  emphasize: string;
  minimize: string;
}

export function getBodyShape(shoulders: number, waist: number, hips: number): BodyShapeName {
  if (!(shoulders > 0 && waist > 0 && hips > 0)) return 'Rectangle';
  const avg = (shoulders + hips) / 2;
  const maxSW = Math.max(shoulders, hips);
  const balanced = Math.abs(shoulders - hips) <= maxSW * 0.05;

  // 腰最宽（或并列最宽）→ Apple
  if (waist >= shoulders && waist >= hips) return 'Apple';
  // 臀明显宽于肩 → Pear
  if (hips > shoulders * 1.05) return 'Pear';
  // 肩明显宽于臀 → Inverted Triangle
  if (shoulders > hips * 1.05) return 'Inverted Triangle';
  // 肩≈臀 且 腰明显细 → Hourglass；否则 → Rectangle
  if (balanced && waist <= avg * 0.75) return 'Hourglass';
  return 'Rectangle';
}

export const BODY_SHAPES: Record<BodyShapeName, BodyShapeInfo> = {
  Hourglass: {
    name: 'Hourglass',
    desc: 'Shoulders and hips are balanced, with a distinctly narrower waist — the classic X silhouette.',
    svg: 'M72,58 L128,58 L116,128 L138,196 L62,196 L84,128 Z',
    wear: ['Wrap dresses', 'Belted waists', 'High-waist bottoms'],
    avoid: ['Baggy, shapeless fits', 'Drop-waist styles'],
    emphasize: 'Your defined waist',
    minimize: '—',
  },
  Pear: {
    name: 'Pear',
    desc: 'Hips are wider than your shoulders; your curves sit below the waist.',
    svg: 'M82,58 L118,58 L110,128 L140,196 L60,196 L90,128 Z',
    wear: ['A-line skirts', 'Wide-leg pants', 'Details & volume up top'],
    avoid: ['Skinny bottoms', 'Heavy belts at the hips'],
    emphasize: 'Shoulders & upper body',
    minimize: 'Hips & thighs',
  },
  Apple: {
    name: 'Apple',
    desc: 'Your midsection is the widest point; shoulders and hips are similar width.',
    svg: 'M70,58 L130,58 L127,130 L130,196 L70,196 L73,130 Z',
    wear: ['Empire waist', 'V-necks', 'Flowy midi lengths'],
    avoid: ['Tight waistbands', 'Clingy knits'],
    emphasize: 'Legs & neckline',
    minimize: 'Midsection',
  },
  Rectangle: {
    name: 'Rectangle',
    desc: 'Shoulders, waist and hips are similar in width — a straight, athletic line.',
    svg: 'M74,58 L126,58 L123,128 L125,196 L75,196 L77,128 Z',
    wear: ['Peplum tops', 'Ruching & ruffles', 'Layered looks'],
    avoid: ['Column shifts', 'Straight, boxy cuts'],
    emphasize: 'Created curves',
    minimize: '—',
  },
  'Inverted Triangle': {
    name: 'Inverted Triangle',
    desc: 'Shoulders are wider than your hips; you carry width up top.',
    svg: 'M60,58 L140,58 L116,128 L104,196 L96,196 L84,128 Z',
    wear: ['Fit-and-flare', 'Full skirts', 'V-necks'],
    avoid: ['Padded shoulders', 'Busy necklines'],
    emphasize: 'Hips & legs',
    minimize: 'Broad shoulders',
  },
};

export const BODY_SHAPE_ORDER: BodyShapeName[] = [
  'Hourglass',
  'Pear',
  'Apple',
  'Rectangle',
  'Inverted Triangle',
];
