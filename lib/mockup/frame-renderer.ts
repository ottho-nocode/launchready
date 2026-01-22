import type { DeviceColor, DeviceType } from '@/types/app';
import { getDeviceColors, getDeviceFrame } from './device-frames';

interface RenderFrameOptions {
  deviceType: DeviceType;
  deviceColor: DeviceColor;
}

/**
 * Renders a device frame using Canvas API
 * Returns null if deviceType is unknown
 */
export function renderDeviceFrame(
  canvas: HTMLCanvasElement,
  options: RenderFrameOptions
): boolean {
  const frame = getDeviceFrame(options.deviceType);
  if (!frame) {
    return false;
  }

  const colors = getDeviceColors(options.deviceColor);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return false;
  }

  // Set canvas dimensions
  canvas.width = frame.frameWidth;
  canvas.height = frame.frameHeight;

  // Clear canvas
  ctx.clearRect(0, 0, frame.frameWidth, frame.frameHeight);

  // Draw outer frame (device body)
  ctx.fillStyle = colors.frame;
  drawRoundedRect(
    ctx,
    0,
    0,
    frame.frameWidth,
    frame.frameHeight,
    frame.cornerRadius
  );

  // Draw bezel (inner border)
  ctx.fillStyle = colors.bezel;
  const bezelInset = frame.bezelWidth / 2;
  drawRoundedRect(
    ctx,
    bezelInset,
    bezelInset,
    frame.frameWidth - bezelInset * 2,
    frame.frameHeight - bezelInset * 2,
    frame.cornerRadius - bezelInset
  );

  // Draw screen area (where screenshot will go)
  ctx.fillStyle = '#000000';
  drawRoundedRect(
    ctx,
    frame.screenOffsetX,
    frame.screenOffsetY,
    frame.screenWidth,
    frame.screenHeight,
    frame.cornerRadius - frame.bezelWidth
  );

  // Draw notch if present (iPhone X style)
  if (frame.notchHeight) {
    ctx.fillStyle = colors.frame;
    const notchWidth = frame.screenWidth * 0.35;
    const notchX = frame.screenOffsetX + (frame.screenWidth - notchWidth) / 2;
    drawRoundedRect(
      ctx,
      notchX,
      frame.screenOffsetY,
      notchWidth,
      frame.notchHeight,
      30
    );
  }

  // Draw home button if present (iPhone 8 style)
  if (frame.homeButtonRadius) {
    ctx.fillStyle = colors.bezel;
    const buttonY = frame.screenOffsetY + frame.screenHeight + 40;
    const buttonX = frame.frameWidth / 2;
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, frame.homeButtonRadius / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  return true;
}

/**
 * Draws a rounded rectangle path and fills it
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Gets the screen area coordinates for placing a screenshot
 */
export function getScreenArea(deviceType: DeviceType) {
  const frame = getDeviceFrame(deviceType);
  if (!frame) {
    return null;
  }

  return {
    x: frame.screenOffsetX,
    y: frame.screenOffsetY,
    width: frame.screenWidth,
    height: frame.screenHeight,
    cornerRadius: frame.cornerRadius - frame.bezelWidth,
  };
}
