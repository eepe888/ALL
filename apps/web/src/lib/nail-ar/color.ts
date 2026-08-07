export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, n));
}

export function shade(hex: string, amount: number): string {
  // amount > 0 lightens toward white, amount < 0 darkens toward black.
  const [r, g, b] = hexToRgb(hex);
  const mix = (channel: number) =>
    amount >= 0
      ? clamp255(channel + (255 - channel) * amount)
      : clamp255(channel * (1 + amount));
  return `rgb(${Math.round(mix(r))}, ${Math.round(mix(g))}, ${Math.round(mix(b))})`;
}
