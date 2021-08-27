import { CanvasInstance } from './config/index.ts';
import { Graph } from './graph/index.ts';
import { Vector2D, background, drawTextWithFont } from './utils/index.ts';

CanvasInstance.init(720, 480);
const { canvas } = CanvasInstance;

// TEST:
const graph = new Graph({
  bar_width: 25,
});

const COLORS = [
  '#345C7D', '#F7B094', '#F5717F', '#F7B094',
  '#6C5B7A',
]

for (let i = 0; i < 12; i++) {
  const clr = COLORS[Math.floor(Math.random() * COLORS.length)];
  const y = Math.floor(Math.random() * 256);
  console.log(`Drawing Bar ${i} with height[${y}] & color[${clr}]`);
  
  graph.add({
    position: new Vector2D(i, y),
    color: clr,
  });
}

graph.draw();



const imageBuffer = canvas.toBuffer();
Deno.writeFileSync('image.png', imageBuffer);