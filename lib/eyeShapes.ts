import { dist } from './landmarkMath';

export type ShapeResult = { name: string; conf: number };

// 可被检测的眼睛类型（基于 landmark 可稳定读取的维度）
export const EYE_ORDER = ['Almond', 'Round', 'Upturned', 'Downturned'];

export const EYE_SHORTDEF: Record<string, string> = {
  Almond: 'Balanced width and height with a gently pointed inner/outer corner',
  Round: 'Tall lid opening with a visibly curved upper and lower lid',
  Upturned: 'Outer corner sits higher than the inner corner',
  Downturned: 'Outer corner sits lower than the inner corner',
};

// 每种眼型的妆容建议（首页结果卡 + 承接页复用）
export const EYE_TIPS: Record<string, { makeup: string }> = {
  Almond: { makeup: 'Balanced lid — most liner styles work; try a pointed wing' },
  Round: { makeup: 'Elongate with外层 cat-eye liner; avoid full round liner' },
  Upturned: { makeup: 'Soften the lift with soft, rounded liner at the outer corner' },
  Downturned: { makeup: 'Lift with upward-angled liner; keep inner corner bright' },
};

// 原型级启发式（478 landmarks）。眼型从 2D landmark 仅能稳定读取
// 倾角(canthal tilt) 与 高宽比；hooded/monolid 需睁眼褶皱信息，2D 不可靠，故不纳入主分类。
export function classifyEye(lm: any): ShapeResult {
  const leftW = dist(lm[33], lm[133]);
  const leftH = dist(lm[159], lm[145]);
  const rightW = dist(lm[263], lm[362]);
  const rightH = dist(lm[386], lm[374]);
  const w = (leftW + rightW) / 2;
  const h = (leftH + rightH) / 2;
  const ratio = h / w; // 高/宽比：越大越「圆」

  // canthal tilt：内眼角 y - 外眼角 y。>0 表示外眼角高于内眼角（上扬）
  const tiltL = lm[133].y - lm[33].y;
  const tiltR = lm[362].y - lm[263].y;
  const tilt = (tiltL + tiltR) / 2;

  if (tilt > 0.03) return { name: 'Upturned', conf: 82 };
  if (tilt < -0.03) return { name: 'Downturned', conf: 82 };
  if (ratio > 0.52) return { name: 'Round', conf: 85 };
  if (ratio < 0.36) return { name: 'Almond', conf: 86 };
  // 中间区间：倾向 Almond（最稳妥）
  return { name: 'Almond', conf: 80 };
}
