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

/**
 * Normalizes the given value to a range
 * @param val Value to normalize
 * @param min Minimum Range
 * @param max Maximum Range
 * @returns The normalized value
 */
export function normalize(val: number, min: number, max: number): number {
  return (val - min) / (max - min);
}

/**
 * Computes the max value within a given array
 * @param array Array of number to find max number of
 */
export function max(array: number[]): number {
  return array.reduce((acc, val) => val > acc ? val : acc, 0);
}