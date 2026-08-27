// 支撑博客注册表 —— 长尾词矩阵，导流回工具页。
// 标题保持 ≤46 字符（layout.tsx 模板 '· FaceShape AI' 会再加 14 字 → 最终 ≤60）。
// 描述 ≤158 字符（留缓冲，避免 Google 截断）。

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'tip'; text: string };

export interface RelatedTool {
  href: string;
  label: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string; // YYYY-MM-DD
  relatedTools: RelatedTool[];
  blocks: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-measure-your-face-shape-at-home',
    title: 'How to Measure Your Face Shape at Home',
    description:
      'Measure your face shape at home with a ruler and mirror—no app needed. Compare to our free live camera tool anytime.',
    excerpt:
      'A step-by-step way to find your face shape with a tape measure, plus when a live camera tool does it for you.',
    category: 'Guides',
    readMinutes: 5,
    publishedAt: '2026-08-27',
    relatedTools: [{ href: '/', label: 'Face Shape Detector (live camera)' }],
    blocks: [
      {
        type: 'p',
        text: 'You do not need an app to get a decent read on your face shape. A ruler, a mirror, and a few minutes are enough to map your proportions and match them to one of the seven common shapes. This guide shows the manual method first, then explains when a live camera tool is the faster, more reliable option.',
      },
      {
        type: 'h2',
        text: 'What you need',
      },
      {
        type: 'ul',
        items: [
          'A flexible tape measure or a flat ruler',
          'A bathroom or vanity mirror with even, front-facing light',
          'A washable marker or a photo you can draw on (optional)',
          'A notebook to record four numbers',
        ],
      },
      {
        type: 'h2',
        text: 'The four measurements',
      },
      {
        type: 'p',
        text: 'Pull your hair back and face the mirror straight on. Measure these four distances and write them down:',
      },
      {
        type: 'ul',
        items: [
          'Forehead: the widest point across your brow, just below the hairline.',
          'Cheekbones: from the outer corner of one eye to the outer corner of the other.',
          'Jawline: the width along your jaw angle, from ear to chin on one side, then doubled.',
          'Face length: the distance from your hairline to the lowest point of your chin.',
        ],
      },
      {
        type: 'h2',
        text: 'How to read the numbers',
      },
      {
        type: 'p',
        text: 'Compare your measurements rather than reading them in isolation. If your face length is noticeably greater than your width, you lean toward oval or oblong. If width and length are close and the jaw is soft, you are likely round. A strong, similar-width forehead, cheekbone, and jaw points to square. A wide forehead narrowing to a small chin is the classic heart shape. The narrowest point sitting at the cheeks means diamond, and a jaw wider than the forehead means triangle.',
      },
      {
        type: 'tip',
        text: 'Manual measuring is great for understanding the ratios, but it is easy to misread a curved jaw or an asymmetric brow. Our free camera tool maps 478 landmarks and returns a confident guess in seconds—no ruler required.',
      },
      {
        type: 'h2',
        text: 'When measuring is enough—and when it is not',
      },
      {
        type: 'p',
        text: 'If you are choosing a haircut or a pair of glasses, a rough shape is usually enough to follow style guides. If you want precise, repeatable results—or you simply want a second opinion—use a live detector. Either way, knowing your shape turns vague advice into a checklist you can actually use.',
      },
    ],
  },

  {
    slug: 'round-vs-oval-face-shape',
    title: 'Round vs Oval Face Shape: How to Tell',
    description:
      'Round and oval faces look alike but differ in proportions. Learn 5 quick checks to tell them apart and why it matters for styling.',
    excerpt:
      'Both are soft and balanced, but the length-to-width ratio and the jawline set them apart. Here are five fast checks.',
    category: 'Comparisons',
    readMinutes: 4,
    publishedAt: '2026-08-27',
    relatedTools: [
      { href: '/face-shapes/round', label: 'Round face shape guide' },
      { href: '/face-shapes/oval', label: 'Oval face shape guide' },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Round and oval are the two shapes people mix up most. Both have soft angles and a balanced feel, but the difference comes down to one ratio and a couple of telltale edges. Get this right and your hairstyle and glasses choices get much easier.',
      },
      {
        type: 'h2',
        text: 'Check 1 — Length versus width',
      },
      {
        type: 'p',
        text: 'An oval face is clearly longer than it is wide. A round face is close to equal in both directions—about as wide as it is long. Place two fingers: if the vertical span clearly beats the horizontal, you are oval.',
      },
      {
        type: 'h2',
        text: 'Check 2 — The jawline',
      },
      {
        type: 'p',
        text: 'Round faces have a soft, curved jaw with no visible angle. Oval faces still keep some curve but the chin is slightly narrower and the cheek-to-chin line is longer, giving a gentle taper rather than a full semicircle.',
      },
      {
        type: 'h2',
        text: 'Check 3 — The forehead and chin balance',
      },
      {
        type: 'p',
        text: 'On an oval, the forehead and jaw are roughly the same width, with the cheeks as the widest area. On a round face, the widest point is often the cheeks too, but the overall silhouette stays circular rather than egg-shaped.',
      },
      {
        type: 'h2',
        text: 'Check 4 — Cheekbone prominence',
      },
      {
        type: 'p',
        text: 'Oval faces usually show high, defined cheekbones. Round faces have cheeks that blend smoothly into the rest of the face without a sharp turn.',
      },
      {
        type: 'h2',
        text: 'Check 5 — How styling differs',
      },
      {
        type: 'p',
        text: 'Round faces benefit from height on top and angles at the jaw—think layered cuts and rectangular frames. Oval faces can wear almost anything but shine with soft, balanced styles. Confusing the two leads to cuts that add roundness when you wanted definition, or flatten a shape that was already long.',
      },
      {
        type: 'tip',
        text: 'Still unsure? Our detector scores both shapes side by side and explains the call, so you can stop guessing.',
      },
    ],
  },

  {
    slug: 'best-hairstyles-by-face-shape',
    title: 'Best Bangs & Hairstyles by Face Shape',
    description:
      'Find the most flattering bangs and cuts for your face shape. A quick guide to balance, soften, or highlight your features.',
    excerpt:
      'Bangs are not one-size-fits-all. Match the fringe and the cut to your face shape for the most flattering result.',
    category: 'Style',
    readMinutes: 6,
    publishedAt: '2026-08-27',
    relatedTools: [
      { href: '/face-shapes/round', label: 'Round face shape' },
      { href: '/face-shapes/square', label: 'Square face shape' },
      { href: '/face-shapes/oval', label: 'Oval face shape' },
      { href: '/face-shapes/heart', label: 'Heart face shape' },
    ],
    blocks: [
      {
        type: 'p',
        text: 'The right haircut does one of three things: it balances a wide area, softens a strong one, or shows off a feature you already love. Bangs are the fastest way to change the silhouette of your face—but the wrong fringe can exaggerate the very thing you wanted to fix.',
      },
      {
        type: 'h2',
        text: 'The basics of fringe',
      },
      {
        type: 'p',
        text: 'A good rule: opposites flatter. Soft, round faces want angles; angular faces want softness; long faces want width up top. Keep the fringe in proportion to your face length, and avoid cutting straight across if your forehead is already the widest part of your face.',
      },
      {
        type: 'h2',
        text: 'Round faces',
      },
      {
        type: 'ul',
        items: [
          'Side-swept bangs to break up the width',
          'Long layers that add height at the crown',
          'Avoid blunt, jaw-length bobs that emphasize the circle',
        ],
      },
      {
        type: 'h2',
        text: 'Square faces',
      },
      {
        type: 'ul',
        items: [
          'Wispy, textured fringe to soften the jaw',
          'Shoulder-length cuts with movement',
          'Avoid sharp, geometric cuts that repeat the square line',
        ],
      },
      {
        type: 'h2',
        text: 'Oval faces',
      },
      {
        type: 'ul',
        items: [
          'Almost any bang works—curtain bangs are a safe, elegant pick',
          'Keep length balanced so the face stays proportioned',
          'Avoid heavy fringe that shortens the face visually',
        ],
      },
      {
        type: 'h2',
        text: 'Heart faces',
      },
      {
        type: 'ul',
        items: [
          'Soft, rounded bangs to fill a narrow chin area visually',
          'Side parts that balance a wide forehead',
          'Avoid short, spiky fringe that widens the top',
        ],
      },
      {
        type: 'tip',
        text: 'Not sure which shape you are? Detect it in seconds, then jump to the dedicated guide for tailored suggestions.',
      },
    ],
  },

  {
    slug: 'glasses-for-your-face-shape',
    title: 'How to Pick Glasses for Your Face Shape',
    description:
      'Match frames to your face shape: round, square, oval, heart and more. A simple guide to flattering glasses.',
    excerpt:
      'The frame that flatters is usually the opposite of your face shape. A quick guide to finding your best pair.',
    category: 'Style',
    readMinutes: 5,
    publishedAt: '2026-08-27',
    relatedTools: [
      { href: '/face-shapes/round', label: 'Round face shape' },
      { href: '/face-shapes/square', label: 'Square face shape' },
      { href: '/face-shapes/oval', label: 'Oval face shape' },
      { href: '/face-shapes/heart', label: 'Heart face shape' },
    ],
    blocks: [
      {
        type: 'p',
        text: 'The oldest rule in eyewear still holds: choose frames that contrast your face shape. Round faces want structure; angular faces want curves. Get the match right and glasses stop being a compromise and start being the best part of your look.',
      },
      {
        type: 'h2',
        text: 'The rule of opposites',
      },
      {
        type: 'p',
        text: 'Your face already has a dominant line—round, square, or elongated. The frame should introduce the line you lack. This creates balance instead of repeating what is already there.',
      },
      {
        type: 'h2',
        text: 'Round faces',
      },
      {
        type: 'ul',
        items: [
          'Rectangular and square frames to add angles',
          'Slightly wider-than-tall lenses',
          'Avoid small round frames that echo the circle',
        ],
      },
      {
        type: 'h2',
        text: 'Square faces',
      },
      {
        type: 'ul',
        items: [
          'Round or oval frames to soften the jaw',
          'Thin rims that do not double the angles',
          'Avoid hard-edged rectangles',
        ],
      },
      {
        type: 'h2',
        text: 'Oval faces',
      },
      {
        type: 'ul',
        items: [
          'Most shapes work—balanced proportions are forgiving',
          'Keep frames in scale with the face',
          'Avoid oversized frames that overwhelm',
        ],
      },
      {
        type: 'h2',
        text: 'Heart faces',
      },
      {
        type: 'ul',
        items: [
          'Bottom-heavy or round frames to widen the chin area',
          'Narrow bridges that fit a smaller lower face',
          'Avoid top-heavy cat-eyes that widen the forehead',
        ],
      },
      {
        type: 'tip',
        text: 'Find your shape first, then browse the frame glossary in your dedicated face shape guide for specific recommendations.',
      },
    ],
  },

  {
    slug: 'face-color-style-connection',
    title: 'Face, Color & Style: Why They Connect',
    description:
      'Your face shape, color season and body shape work together. Learn how to build a cohesive personal style from all three.',
    excerpt:
      'Face shape is only one piece. Combine it with your color season and body shape for a style that actually fits you.',
    category: 'Style',
    readMinutes: 6,
    publishedAt: '2026-08-27',
    relatedTools: [
      { href: '/color-analysis', label: 'Color Analysis (quiz)' },
      { href: '/body-shape', label: 'Body Shape (measure)' },
      { href: '/', label: 'Face Shape Detector' },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Most style advice treats face shape, color, and body as separate topics. In real life they stack. The cut that flatters your face, the palette that lights up your skin, and the silhouette that suits your body all pull in the same direction when you treat them as one system.',
      },
      {
        type: 'h2',
        text: 'Face shape = your structure',
      },
      {
        type: 'p',
        text: 'Your face shape tells you about lines and proportions: which cuts, bangs, and frames create balance. It is the frame around your expressions, and it is the easiest place to start because it is fixed and quick to read.',
      },
      {
        type: 'h2',
        text: 'Color season = your palette',
      },
      {
        type: 'p',
        text: 'Color analysis maps your natural hair, skin, and eye tones to a season—Spring, Summer, Autumn, or Winter. Wearing your season’s shades makes you look brighter and more rested without changing a thing about your features.',
      },
      {
        type: 'h2',
        text: 'Body shape = your silhouette',
      },
      {
        type: 'p',
        text: 'Body shape is about where your width sits—shoulders, waist, hips. The right neckline, sleeve, and proportion extend the same balance idea from your face down through your whole outfit.',
      },
      {
        type: 'h2',
        text: 'Building a cohesive look',
      },
      {
        type: 'p',
        text: 'Start with your color season so everything you buy already works together. Then use face shape for hair and glasses, and body shape for fit. When all three agree, getting dressed stops being a daily guessing game.',
      },
      {
        type: 'tip',
        text: 'Run the color quiz and the body measure, then come back to your face shape—three free tools, one clear picture of your style.',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
