import { rgba, shade } from "./color";
import { findColor, findDesign } from "./designs";
import type { NailGeometry, NailStyle } from "@/types/nail-ar";

function drawFinishFill(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  hex: string,
  finish: NailStyle["finish"]
) {
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

  switch (finish) {
    case "gradient": {
      const gradient = ctx.createLinearGradient(-rx, 0, rx, 0);
      gradient.addColorStop(0, rgba(shade(hex, 0.35), 0.88));
      gradient.addColorStop(1, rgba(shade(hex, -0.25), 0.88));
      ctx.fillStyle = gradient;
      break;
    }
    case "matte":
      ctx.fillStyle = rgba(shade(hex, -0.08), 0.82);
      break;
    case "glossy":
    case "glitter":
    case "solid":
    default:
      ctx.fillStyle = rgba(hex, 0.86);
      break;
  }
  ctx.fill();

  if (finish === "glossy") {
    ctx.beginPath();
    ctx.ellipse(-rx * 0.3, -ry * 0.35, rx * 0.35, ry * 0.22, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fill();
  }

  if (finish === "glitter") {
    const sparkleCount = 10;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(rx, ry) * 0.85;
      const sx = Math.cos(angle) * radius * (rx / Math.max(rx, ry));
      const sy = Math.sin(angle) * radius * (ry / Math.max(rx, ry));
      ctx.beginPath();
      ctx.arc(sx, sy, 0.6 + Math.random() * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`;
      ctx.fill();
    }
  }
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.35);
  ctx.bezierCurveTo(-size, -size * 0.4, -size * 0.5, -size, 0, -size * 0.25);
  ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.4, 0, size * 0.35);
  ctx.closePath();
}

function drawDesignOverlay(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  hex: string,
  designId: string
) {
  switch (designId) {
    case "french-classic":
    case "french-color": {
      const bandColor =
        designId === "french-classic"
          ? "rgba(255, 250, 245, 0.92)"
          : rgba(shade(hex, -0.35), 0.92);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(rx * 0.55, 0, rx * 0.6, ry * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = bandColor;
      ctx.fill();
      ctx.restore();
      break;
    }
    case "one-point-heart": {
      ctx.save();
      ctx.translate(-rx * 0.05, 0);
      ctx.scale(0.9, 0.9);
      drawHeart(ctx, Math.min(rx, ry) * 0.4);
      ctx.fillStyle = "rgba(230, 60, 90, 0.9)";
      ctx.fill();
      ctx.restore();
      break;
    }
    case "stone": {
      const positions = [
        [-rx * 0.3, -ry * 0.2],
        [0, ry * 0.1],
        [rx * 0.3, -ry * 0.25],
      ];
      for (const [sx, sy] of positions) {
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, ry * 0.18);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(1, "rgba(214, 179, 74, 0.85)");
        ctx.beginPath();
        ctx.arc(sx, sy, ry * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      break;
    }
    case "marble": {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = Math.max(1, ry * 0.08);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-rx, i * ry * 0.4);
        ctx.bezierCurveTo(
          -rx * 0.2,
          i * ry * 0.4 + ry * 0.3,
          rx * 0.2,
          i * ry * 0.4 - ry * 0.3,
          rx,
          i * ry * 0.4
        );
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case "plain":
    default:
      break;
  }
}

export function drawNail(
  ctx: CanvasRenderingContext2D,
  geometry: NailGeometry,
  style: NailStyle,
  isSelected: boolean
) {
  const color = findColor(style.colorId);
  const design = findDesign(style.designId);
  const rx = geometry.length / 2;
  const ry = geometry.width / 2;

  ctx.save();
  ctx.translate(geometry.center.x, geometry.center.y);
  ctx.rotate(geometry.angleRad);

  drawFinishFill(ctx, rx, ry, color.hex, style.finish);
  drawDesignOverlay(ctx, rx, ry, color.hex, design.id);

  if (isSelected) {
    ctx.beginPath();
    ctx.ellipse(0, 0, rx + 2, ry + 2, 0, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(37, 99, 235, 0.9)";
    ctx.stroke();
  }

  ctx.restore();
}
