import { dist } from './landmarkMath';

export type ShapeResult = { name: string; conf: number };

// 鼻型（基于 landmark 可读取的宽/长比例）。鼻型无像「7 种脸型」那样公认标准 schema，
// 这里用最稳的宽长比例做结构化描述，不夸大细分类型。
export const NOSE_ORDER = ['Balanced', 'Wide', 'Narrow', 'Long', 'Short'];

export const NOSE_SHORTDEF: Record<string, string> = {
  Balanced: 'Proportionate width and length — a straight, even bridge',
  Wide: 'Broader across the nostrils relative to face width',
  Narrow: 'Slim bridge and nostrils relative to face width',
  Long: 'Bridge extends further down the mid-face',
  Short: 'Compact bridge — button-like proportions',
};

export const NOSE_TIPS: Record<string, { contour: string }> = {
  Balanced: { contour: 'A soft side contour down the bridge adds gentle definition' },
  Wide: { contour: 'Contour the sides of the bridge to slim the appearance' },
  Narrow: { contour: 'A touch of highlight down the bridge widens the look' },
  Long: { contour: 'Keep contour low and soft to avoid lengthening further' },
  Short: { contour: 'Light vertical highlight lifts and elongates the bridge' },
};

// 原型级启发式（478 landmarks）：鼻宽(鼻孔外侧 98/327) 与 鼻长(山根 6 → 鼻尖 1)
// 相对脸宽/脸长做比例分类。
export function classifyNose(lm: any): ShapeResult {
  const noseW = dist(lm[98], lm[327]);
  const noseLen = dist(lm[6], lm[1]);
  const faceW = dist(lm[234], lm[454]);
  const faceLen = dist(lm[10], lm[152]);
  const widRatio = noseW / faceW;
  const lenRatio = noseLen / faceLen;

  if (widRatio > 0.3) return { name: 'Wide', conf: 80 };
  if (widRatio < 0.21) return { name: 'Narrow', conf: 80 };
  if (lenRatio > 0.52) return { name: 'Long', conf: 78 };
  if (lenRatio < 0.4) return { name: 'Short', conf: 78 };
  return { name: 'Balanced', conf: 84 };
}
