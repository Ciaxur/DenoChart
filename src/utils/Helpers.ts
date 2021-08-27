import { CanvasInstance } from '../config/index.ts';


/**
 * Sets the background color
 * @param r Red Channel
 * @param g Green Channel
 * @param b Blue Channel
 * @param a Alpha Channel
 */
export function background(r: number, g: number, b: number, a = 1.0) {
  const { ctx, HEIGHT, WIDTH } = CanvasInstance;
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}


/**
 * Helper function that draws given text with a font, restoring the font
 *  back to the original
 * @param text Text to draw
 * @param x X-Axis Position
 * @param y Y-Axis Position
 * @param font (Optional) Font Name
 */
export function drawTextWithFont(text: string, x: number, y: number, font?: string) {
  const { ctx } = CanvasInstance;
  const originalFont = ctx.font;
  ctx.font = font || originalFont;
  ctx.fillText(text, x, y);
  ctx.font = originalFont;
}