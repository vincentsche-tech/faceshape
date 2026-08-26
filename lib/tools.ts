// 工具矩阵注册表 —— 阶段 2 姐妹工具。
// type: camera = 复用 MediaPipe 摄像头; quiz = 纯问卷; measure = 纯测量输入。
export type ToolType = 'camera' | 'quiz' | 'measure';

export interface Tool {
  slug: string;
  name: string;
  href: string;
  type: ToolType;
  tagline: string;
  blurb: string;
  available: boolean;
  category: 'features' | 'colors' | 'body';
}

export const TOOLS: Tool[] = [
  {
    slug: 'face',
    name: 'Face Shape',
    href: '/',
    type: 'camera',
    tagline: 'Detect your face shape live',
    blurb: 'Turn on your camera and watch your face shape appear in real time. Get hairstyle, glasses and makeup tips.',
    available: true,
    category: 'features',
  },
  {
    slug: 'eye',
    name: 'Eye Shape',
    href: '/eye-shape',
    type: 'camera',
    tagline: 'Find your eye shape & tilt',
    blurb: 'Read your eye shape, canthal tilt and setting from 478 landmarks. Get tailored eye-makeup tips.',
    available: true,
    category: 'features',
  },
  {
    slug: 'nose',
    name: 'Nose Shape',
    href: '/nose-shape',
    type: 'camera',
    tagline: 'Read your nose structure',
    blurb: 'Map your nose width and length proportions. Get contour guidance that flatters your structure.',
    available: true,
    category: 'features',
  },
  {
    slug: 'color',
    name: 'Color Analysis',
    href: '/color-analysis',
    type: 'quiz',
    tagline: 'Discover your color season',
    blurb: 'Answer a few questions about your natural coloring to find your season and the shades that flatter you.',
    available: true,
    category: 'colors',
  },
  {
    slug: 'body',
    name: 'Body Shape',
    href: '/body-shape',
    type: 'measure',
    tagline: 'Find your body shape',
    blurb: 'Enter your measurements to discover your body shape and get personalized clothing suggestions.',
    available: true,
    category: 'body',
  },
];
