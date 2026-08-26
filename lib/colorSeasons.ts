// Color Analysis（四季色彩理论 quiz）—— 纯客户端逻辑，无 ML。
// 维度：undertone(warm/cool/neutral) × value(light/deep) × chroma(soft/bright) → 4 季。

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface ColorOption {
  label: string;
  vote: { u?: 'warm' | 'cool' | 'neutral'; v?: 'light' | 'deep'; c?: 'soft' | 'bright' };
}

export interface ColorQuestion {
  id: string;
  q: string;
  options: ColorOption[];
}

export const COLOR_QUESTIONS: ColorQuestion[] = [
  {
    id: 'veins',
    q: 'Look at the veins on your wrist in natural light. What color are they?',
    options: [
      { label: 'Blue or purple', vote: { u: 'cool' } },
      { label: 'Green or olive', vote: { u: 'warm' } },
      { label: "Can't tell / a mix of both", vote: { u: 'neutral' } },
    ],
  },
  {
    id: 'jewelry',
    q: 'Which metal jewelry looks better against your skin?',
    options: [
      { label: 'Silver', vote: { u: 'cool' } },
      { label: 'Gold', vote: { u: 'warm' } },
      { label: 'Both look fine', vote: { u: 'neutral' } },
    ],
  },
  {
    id: 'hair',
    q: 'Your natural (untreated) hair color is closest to…',
    options: [
      { label: 'Platinum, ash, or gray', vote: { v: 'light', u: 'cool' } },
      { label: 'Golden blonde or red', vote: { v: 'light', u: 'warm' } },
      { label: 'Dark brown or black', vote: { v: 'deep' } },
    ],
  },
  {
    id: 'eyes',
    q: 'Your natural eye color is…',
    options: [
      { label: 'Blue, gray, or light hazel', vote: { v: 'light' } },
      { label: 'Deep brown or near-black', vote: { v: 'deep' } },
      { label: 'Green or amber hazel', vote: { v: 'light', u: 'warm' } },
    ],
  },
  {
    id: 'sun',
    q: 'After 20 minutes in the sun with no protection, you…',
    options: [
      { label: 'Burn first, then tan slowly', vote: { v: 'light', u: 'cool' } },
      { label: 'Tan easily, rarely burn', vote: { v: 'deep', u: 'warm' } },
    ],
  },
  {
    id: 'white',
    q: 'In a pure white shirt, your skin looks…',
    options: [
      { label: 'Pink or bluish', vote: { u: 'cool' } },
      { label: 'Yellow or golden', vote: { u: 'warm' } },
    ],
  },
  {
    id: 'lip',
    q: 'Which lipstick tone flatters you more?',
    options: [
      { label: 'Coral or peach', vote: { u: 'warm', c: 'bright' } },
      { label: 'Rose or berry', vote: { u: 'cool', c: 'soft' } },
    ],
  },
  {
    id: 'contrast',
    q: 'Overall, your features read as…',
    options: [
      { label: 'Soft, low contrast', vote: { c: 'soft' } },
      { label: 'Clear, high contrast', vote: { c: 'bright' } },
    ],
  },
];

export interface ColorSeason {
  name: Season;
  tagline: string;
  desc: string;
  palette: string[];
  wear: string[];
  avoid: string[];
  makeup: string;
}

export const COLOR_SEASONS: Record<Season, ColorSeason> = {
  Spring: {
    name: 'Spring',
    tagline: 'Warm, bright & light',
    desc: 'You glow in warm, clear, sunny colors with a touch of brightness — coral, peach and turquoise all lift you.',
    palette: ['#F4A261', '#E76F51', '#E9C46A', '#2A9D8F', '#8ECAE6', '#FFD6A5', '#F4978E', '#B5E48C'],
    wear: ['Coral & peach', 'Warm turquoise', 'Golden yellow', 'Light grass green'],
    avoid: ['Black (too heavy)', 'Muted gray-blue', 'Icy pastels'],
    makeup: 'Warm peach blush, coral lip, golden highlighter.',
  },
  Summer: {
    name: 'Summer',
    tagline: 'Cool, soft & light',
    desc: 'You suit gentle, cool, slightly muted tones — powder blue, rose, lavender and soft gray.',
    palette: ['#A8DADC', '#CDB4DB', '#FFCAD4', '#BDE0FE', '#C8B6A6', '#E8DFF5', '#A3C4BC', '#F1C0D6'],
    wear: ['Powder blue', 'Dusty rose', 'Lavender', 'Soft gray'],
    avoid: ['Bright orange', 'Pure black', 'Harsh primary red'],
    makeup: 'Rosy blush, berry-pink lip, cool-toned highlighter.',
  },
  Autumn: {
    name: 'Autumn',
    tagline: 'Warm, muted & deep',
    desc: 'Earthy, warm, rich shades flatter you — mustard, terracotta, olive and toffee.',
    palette: ['#BC6C25', '#9C6644', '#DDA15E', '#606C38', '#7F5539', '#B5838D', '#CB997E', '#A68A64'],
    wear: ['Mustard & olive', 'Terracotta', 'Toffee brown', 'Rust red'],
    avoid: ['Cool pastel blue', 'Fuchsia', 'Icy pink'],
    makeup: 'Bronze warmth, terracotta lip, golden highlighter.',
  },
  Winter: {
    name: 'Winter',
    tagline: 'Cool, clear & deep',
    desc: 'You carry high contrast — true black, white, royal blue, emerald and ruby.',
    palette: ['#1D3557', '#E63946', '#06D6A0', '#FF006E', '#118AB2', '#073B4C', '#111111', '#FFFFFF'],
    wear: ['True black & white', 'Royal blue', 'Emerald', 'Ruby red'],
    avoid: ['Warm beige', 'Muted olive', 'Soft peach'],
    makeup: 'Bold berry lip, cool pink blush, icy highlighter.',
  },
};

function mode(values: string[]): string | undefined {
  if (!values.length) return undefined;
  const count: Record<string, number> = {};
  for (const v of values) count[v] = (count[v] ?? 0) + 1;
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

// 把 8 题累积的投票映射到 4 季之一。
export function getSeason(votes: { u: string[]; v: string[]; c: string[] }): Season {
  const u = mode(votes.u) as 'warm' | 'cool' | 'neutral' | undefined;
  const v = mode(votes.v) as 'light' | 'deep' | undefined;
  const c = mode(votes.c) as 'soft' | 'bright' | undefined;

  if (u === 'cool') return v === 'deep' || c === 'bright' ? 'Winter' : 'Summer';
  if (u === 'warm') return v === 'deep' || c === 'soft' ? 'Autumn' : 'Spring';

  // neutral undertone：用 value + chroma 兜底
  if (v === 'deep') return c === 'soft' ? 'Autumn' : 'Winter';
  if (v === 'light') return c === 'soft' ? 'Summer' : 'Spring';
  return c === 'soft' ? 'Summer' : 'Spring';
}
