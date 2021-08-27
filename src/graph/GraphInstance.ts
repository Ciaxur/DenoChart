import { CanvasInstance } from '../config/index.ts';
import { Vector2D, background, drawTextWithFont } from '../utils/index.ts';


interface GraphOptions {
  bar_width:    number,
  bar_spacing:  number,

}

interface BarEntry {
  position: Vector2D,
  color:    string,
}

export class Graph {
  // Graph Offsets
  private y_offset = 30;
  private x_offset = 30;
  private y_padding = 30;
  private x_padding = 50;

  private _entries: BarEntry[] = [];

  // Graph Configuration
  private _options: GraphOptions;
  // TODO:
  //  - Add Labels
  //  - Add Bar Colors

  
  constructor(config?: Partial<GraphOptions>) {
    // Configure Graph
    this._options = {
      bar_width: config && config.bar_width     || 10,
      bar_spacing: config && config.bar_spacing || 5,
    }
  }


  public add(entry: BarEntry): void {
    this._entries.push(entry);
  }
  
  private _draw_graph_outline() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    
    // CTX Config
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Drawing Style Config
    ctx.save();
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 1.5;

    // Graph Title
    drawTextWithFont('Title', (WIDTH / 2) - 30, this.y_offset, '12pt Cochin');

    // X-Axis
    ctx.fillText('X-Axis', (WIDTH / 2) - 10, (HEIGHT - this.y_offset / 2) + 5);

    ctx.beginPath();
    ctx.lineTo(this.x_padding, HEIGHT - this.y_padding);
    ctx.lineTo(this.x_padding, this.y_padding);
    ctx.stroke();
    ctx.closePath();

    // Y-Axis
    ctx.fillText('Y-Axis', (this.x_offset / 2) - 8, (HEIGHT / 2));

    ctx.beginPath();
    ctx.lineTo(this.x_padding, HEIGHT - this.y_padding);
    ctx.lineTo(WIDTH - this.x_padding, HEIGHT - this.y_padding);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  private _draw_bars() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { bar_width, bar_spacing } = this._options;
    
    ctx.save();
    this._entries.forEach((entry, idx) => {
      const { x, y } = entry.position;
      
      ctx.fillStyle = entry.color;
      ctx.beginPath();
      // TODO: Calc. spacing based on boudnaries & size
      
      ctx.fillRect(
        x + this.x_padding + bar_spacing + (x * (bar_spacing + bar_width)),
        HEIGHT - this.y_offset - y,
        bar_width, 
        y,
      );

      ctx.closePath();
    });
    ctx.restore();
  }
  
  public draw() {
    background(50, 50, 50, 0.5);
    
    this._draw_bars();
    this._draw_graph_outline();
  }

};