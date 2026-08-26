// 7 脸型数据层 —— 从已验证原型 tmp/gen_face_shapes.py 1:1 搬运。
// 子页路由 app/face-shapes/[shape]/page.tsx 与 sitemap 共用。

export type FaceShapeFaq = { q: string; a: string };

export type FaceShape = {
  slug: string;
  name: string;
  title: string;
  desc: string;
  h1: string;
  sub: string;
  ratio: string;
  features: string[];
  svg: string; // SVG path，viewBox 0 0 200 240
  hairMen: string[];
  hairWomen: string[];
  hairLen: { men: 'Short' | 'Medium' | 'Long'; women: 'Short' | 'Medium' | 'Long' };
  hairStyleMen: string[][];
  hairStyleWomen: string[][];
  glasses: string[];
  faqs: FaceShapeFaq[];
};

export const FACE_SHAPES: Record<string, FaceShape> = {
  oval: {
    slug: 'oval',
    name: 'Oval',
    title: 'Oval Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'The most versatile face shape: balanced proportions, gently rounded jaw and hairline. See features, best hairstyles for men and women, and glasses that flatter an oval face.',
    h1: 'Oval Face Shape',
    sub: 'The most versatile face shape — balanced, softly rounded, and flattered by almost any cut. See your features, best hairstyles and glasses.',
    ratio: 'Length is about 1.5x the width; the forehead is slightly wider than the jaw, with a softly rounded hairline and chin.',
    features: [
      'Balanced, softly rounded proportions',
      'Jawline slightly narrower than the forehead',
      'No single feature dominates the face',
    ],
    svg: 'M100,18 C140,18 158,68 158,118 C158,178 132,222 100,222 C68,222 42,178 42,118 C42,68 60,18 100,18 Z',
    hairMen: [
      'Short sides with a textured top — quiff, side part, or crop',
      'Classic taper or buzz with subtle length left on top',
      'Medium-length swept-back or messy style',
    ],
    hairWomen: [
      'Long layers that graze the shoulders',
      'Soft waves and loose beach waves',
      'Middle part with curtain bangs',
    ],
    hairLen: { men: 'Medium', women: 'Long' },
    hairStyleMen: [['Texture', 'Side part'], ['Taper'], ['Volume', 'Length']],
    hairStyleWomen: [['Layers', 'Length'], ['Waves', 'Texture'], ['Bangs', 'Part']],
    glasses: [
      'Aviators and rounded rectangles',
      'Cat-eye frames for a touch of contrast',
      'Most shapes work — oval is the most flexible face',
    ],
    faqs: [
      {
        q: 'What makes a face oval?',
        a: 'An oval face is longer than it is wide, with a gently rounded jaw and hairline and balanced, even proportions.',
      },
      {
        q: 'Can oval faces wear any hairstyle?',
        a: 'Almost — oval is the most flexible shape, so most cuts and lengths flatter it.',
      },
      {
        q: 'Best glasses for an oval face?',
        a: 'Most frame shapes suit an oval face; rounded rectangles and aviators are safe, classic picks.',
      },
    ],
  },
  round: {
    slug: 'round',
    name: 'Round',
    title: 'Round Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'A round face is about as wide as it is long, with full cheeks and a soft chin. See features, slimming hairstyles for men and women, and angular glasses that add definition.',
    h1: 'Round Face Shape',
    sub: 'About as wide as it is long, with full cheeks and few angles. The goal: add length and definition with cut and frames.',
    ratio: 'Width and length are close; full cheeks and a soft, round chin with almost no angles in the bone structure.',
    features: ['Similar width and height', 'Rounded hairline and jaw', 'Full cheeks, soft angles throughout'],
    svg: 'M100,24 C152,24 172,78 172,120 C172,176 140,216 100,216 C60,216 28,176 28,120 C28,78 48,24 100,24 Z',
    hairMen: [
      'Height on top with short sides — pompadour or quiff',
      'Angular fringe to break up the roundness',
      'Avoid tight curls that add width at the sides',
    ],
    hairWomen: [
      'Long layers past the shoulders',
      'Side-swept bangs and volume at the crown',
      'Asymmetrical cuts that elongate the face',
    ],
    hairLen: { men: 'Short', women: 'Long' },
    hairStyleMen: [['Volume', 'Height'], ['Bangs'], ['Avoid width']],
    hairStyleWomen: [['Layers', 'Length'], ['Bangs', 'Volume'], ['Asym', 'Length']],
    glasses: [
      'Rectangular and square frames',
      'Angular, geometric shapes',
      'Avoid small round frames that echo the roundness',
    ],
    faqs: [
      {
        q: 'What defines a round face?',
        a: 'A round face has similar width and length, full cheeks, and a soft chin with few angles.',
      },
      {
        q: 'Which hairstyle slims a round face?',
        a: 'Add height on top and keep the sides shorter; side-swept bangs and long layers elongate the look.',
      },
      {
        q: 'Best glasses for a round face?',
        a: 'Angular, rectangular frames add definition; avoid small round frames that emphasize roundness.',
      },
    ],
  },
  square: {
    slug: 'square',
    name: 'Square',
    title: 'Square Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'A square face has a strong, angular jaw and a broad forehead of similar width. See features, softening hairstyles for men and women, and round frames that balance the angles.',
    h1: 'Square Face Shape',
    sub: 'A broad forehead, strong jaw and sharp angles. Soften the structure with rounded cuts and curved frames.',
    ratio: 'Forehead, cheekbones and jaw are roughly equal width; a strong, angular jawline is the signature feature.',
    features: ['Broad, flat forehead', 'Strong, square jaw', 'Minimal curves in the bone structure'],
    svg: 'M52,28 L148,28 C166,28 172,46 172,72 L172,168 C172,196 154,212 130,212 L70,212 C46,212 28,196 28,168 L28,72 C28,46 34,28 52,28 Z',
    hairMen: [
      'Textured crop with a soft fringe',
      'Side part to soften the jawline',
      'Medium length with movement, not too tight',
    ],
    hairWomen: [
      'Soft layers around the jaw',
      'Wavy lobs and side parts',
      'Long layers to balance the strong jaw',
    ],
    hairLen: { men: 'Medium', women: 'Medium' },
    hairStyleMen: [['Texture', 'Bangs'], ['Part'], ['Length', 'Movement']],
    hairStyleWomen: [['Layers', 'Jaw'], ['Waves', 'Part'], ['Layers', 'Length']],
    glasses: [
      'Round and oval frames to soften',
      'Rimless and light frames',
      'Avoid heavy square frames that double the angles',
    ],
    faqs: [
      {
        q: 'What defines a square face?',
        a: 'A square face has a broad forehead, strong angular jaw, and similar widths across the brow, cheeks and jaw.',
      },
      {
        q: 'How do I soften a square jaw with hair?',
        a: 'Soft layers, side parts and waves break up the angles; avoid blunt, jaw-length bobs.',
      },
      {
        q: 'Best glasses for a square face?',
        a: 'Round or oval, rimless frames soften the angles; skip heavy square frames.',
      },
    ],
  },
  heart: {
    slug: 'heart',
    name: 'Heart',
    title: 'Heart Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'A heart face has a wide forehead and cheekbones with a narrow, pointed chin. See features, balancing hairstyles for men and women, and frames that widen the lower face.',
    h1: 'Heart Face Shape',
    sub: 'Wide forehead and cheekbones tapering to a pointed chin — like an inverted triangle. Balance the widths with cut and frames.',
    ratio: 'Wide forehead and cheekbones with a narrow, pointed chin — an inverted-triangle silhouette.',
    features: ['Broad forehead, narrow chin', 'High, wide cheekbones', 'Pointed or V-shaped jaw'],
    svg: 'M100,28 C132,12 168,24 168,70 C168,122 142,152 112,186 C108,196 100,214 100,214 C100,214 92,196 88,186 C58,152 32,122 32,70 C32,24 68,12 100,28 Z',
    hairMen: [
      'Side part with volume on top',
      'Textured fringe to balance the width',
      'Avoid buzzed sides that spotlight the forehead',
    ],
    hairWomen: [
      'Chin-length bobs and lobs',
      'Side-swept bangs to narrow the forehead',
      'Layers that add width at the jaw',
    ],
    hairLen: { men: 'Medium', women: 'Medium' },
    hairStyleMen: [['Volume', 'Part'], ['Texture', 'Bangs'], ['Avoid sides']],
    hairStyleWomen: [['Length', 'Jaw'], ['Bangs', 'Part'], ['Layers', 'Width']],
    glasses: [
      'Bottom-heavy or round frames',
      'Aviators and rimless styles',
      'Avoid top-heavy cat-eyes that widen the brow',
    ],
    faqs: [
      {
        q: 'What defines a heart face?',
        a: 'A heart face has a wide forehead and cheekbones that taper to a narrow, pointed chin.',
      },
      {
        q: 'How do I balance a heart face?',
        a: 'Add width at the jaw and chin with layered cuts and side-swept bangs; avoid volume on top.',
      },
      {
        q: 'Best glasses for a heart face?',
        a: 'Bottom-heavy or round frames balance the narrow chin; skip top-heavy styles.',
      },
    ],
  },
  oblong: {
    slug: 'oblong',
    name: 'Oblong',
    title: 'Oblong Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'An oblong face is noticeably longer than wide, with a straight cheek line. See features, width-adding hairstyles for men and women, and wider frames that shorten the look.',
    h1: 'Oblong Face Shape',
    sub: 'Noticeably longer than wide, with a straight cheek line and a narrow chin. Add width and softness with cut and frames.',
    ratio: 'Longer than wide, with a straight cheek line and a narrow chin and forehead of similar width.',
    features: ['Noticeably longer than wide', 'Straight, narrow cheeks', 'Similar forehead and jaw width'],
    svg: 'M100,14 C136,14 150,68 150,120 C150,186 124,226 100,226 C76,226 50,186 50,120 C50,68 64,14 100,14 Z',
    hairMen: [
      'Side parts with low volume',
      'Textured fringe to visually shorten the face',
      'Medium length; avoid extra height on top',
    ],
    hairWomen: [
      'Chin-length cuts and full bangs',
      'Layered bobs that add width',
      'Volume on the sides, not the crown',
    ],
    hairLen: { men: 'Medium', women: 'Short' },
    hairStyleMen: [['Part', 'Low volume'], ['Texture', 'Bangs'], ['Length', 'Avoid height']],
    hairStyleWomen: [['Length', 'Bangs'], ['Layers', 'Width'], ['Volume', 'Sides']],
    glasses: [
      'Wider frames with a low bridge',
      'Round frames and decorative temples',
      'Avoid small, narrow frames',
    ],
    faqs: [
      {
        q: 'What defines an oblong face?',
        a: 'An oblong face is longer than wide, with a straight cheek line and similar forehead and jaw widths.',
      },
      {
        q: 'How do I shorten an oblong face?',
        a: 'Full bangs, chin-length cuts and side volume break up the length; avoid height on top.',
      },
      {
        q: 'Best glasses for an oblong face?',
        a: 'Wider frames with a low bridge add width; skip small, narrow shapes.',
      },
    ],
  },
  diamond: {
    slug: 'diamond',
    name: 'Diamond',
    title: 'Diamond Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'A diamond face has narrow forehead and chin with the cheeks as the widest point. See features, framing hairstyles for men and women, and oval frames that soften the angles.',
    h1: 'Diamond Face Shape',
    sub: 'Cheekbones are the widest point, with a narrow forehead and jaw. Frame the face and fill the temples with cut and frames.',
    ratio: 'Narrow forehead and chin with the cheeks as the widest point — angular and high-set.',
    features: ['Cheekbones are the widest point', 'Narrow forehead and jawline', 'Angular, defined bone structure'],
    svg: 'M100,22 C122,38 152,54 162,94 C170,130 150,160 120,186 C110,200 100,214 100,214 C100,214 90,200 80,186 C50,160 30,130 38,94 C48,54 78,38 100,22 Z',
    hairMen: [
      'Textured fringe to widen the forehead',
      'Side parts with soft volume',
      'Avoid slicked-back looks that bare the temples',
    ],
    hairWomen: [
      'Chin-length layers that fill the jaw',
      'Side-swept bangs to soften the cheekbones',
      'Volume at the temples',
    ],
    hairLen: { men: 'Medium', women: 'Medium' },
    hairStyleMen: [['Texture', 'Bangs'], ['Part', 'Volume'], ['Avoid slick']],
    hairStyleWomen: [['Length', 'Jaw'], ['Bangs', 'Soft'], ['Volume', 'Temples']],
    glasses: [
      'Oval and rimless frames',
      'Cat-eyes that lift the brow',
      'Avoid narrow, angular frames',
    ],
    faqs: [
      {
        q: 'What defines a diamond face?',
        a: 'A diamond face has narrow forehead and chin with the cheekbones as the widest point.',
      },
      {
        q: 'How do I balance a diamond face?',
        a: 'Add width at the forehead and jaw with fringe and chin-length layers; soften the cheekbones.',
      },
      {
        q: 'Best glasses for a diamond face?',
        a: 'Oval or rimless frames soften the angles; cat-eyes lift the brow nicely.',
      },
    ],
  },
  triangle: {
    slug: 'triangle',
    name: 'Triangle',
    title: 'Triangle Face Shape — Features, Best Hairstyles & Glasses',
    desc: 'A triangle face has a narrow forehead with a broad, strong jaw — the widest point is the bottom. See features, top-volume hairstyles for men and women, and top-heavy frames.',
    h1: 'Triangle Face Shape',
    sub: 'Narrow forehead with a broad, strong jaw — the widest point is the bottom. Add width up top to balance.',
    ratio: 'Narrow forehead with a broad, strong jaw — the widest point is the bottom of the face.',
    features: ['Jaw wider than the forehead', 'Narrow upper face', 'Strong, prominent chin'],
    svg: 'M68,28 L132,28 C156,50 172,92 172,134 C172,182 138,214 100,214 C62,214 28,182 28,134 C28,92 44,50 68,28 Z',
    hairMen: [
      'Volume and fringe on top',
      'Textured crops to balance the jaw',
      'Avoid very short sides that emphasize width below',
    ],
    hairWomen: [
      'Layers and volume at the crown',
      'Side bangs to widen the forehead',
      'Chin-length or longer to soften the jaw',
    ],
    hairLen: { men: 'Medium', women: 'Medium' },
    hairStyleMen: [['Volume', 'Bangs'], ['Texture', 'Jaw'], ['Avoid sides']],
    hairStyleWomen: [['Layers', 'Crown'], ['Bangs', 'Width'], ['Length', 'Jaw']],
    glasses: [
      'Top-heavy and decorative frames',
      'Cat-eye and browline shapes',
      'Avoid bottom-heavy frames',
    ],
    faqs: [
      {
        q: 'What defines a triangle face?',
        a: 'A triangle face has a narrow forehead and a broad, strong jaw — widest at the bottom.',
      },
      {
        q: 'How do I balance a triangle face?',
        a: 'Add volume and width at the forehead and crown; side bangs help narrow the jaw read.',
      },
      {
        q: 'Best glasses for a triangle face?',
        a: 'Top-heavy, decorative frames like cat-eyes balance the wider jaw; avoid bottom-heavy shapes.',
      },
    ],
  },
};

// 展示顺序（与专页 shapegrid、sitemap 一致）
export const FACE_SHAPE_ORDER = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond', 'triangle'];

export function getFaceShape(slug: string): FaceShape | undefined {
  return FACE_SHAPES[slug];
}

export function faceShapeSlugs(): string[] {
  return FACE_SHAPE_ORDER;
}
