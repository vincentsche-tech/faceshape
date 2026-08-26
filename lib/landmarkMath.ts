// 共享的 landmark 几何工具，供 Eye / Nose 分类函数复用
export function dist(a: any, b: any): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// 两点连线相对于水平轴的夹角（弧度），y 轴向下为正
export function slope(a: any, b: any): number {
  return (b.y - a.y) / (b.x - a.x || 1e-6);
}
