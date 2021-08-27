import { CanvasInstance } from '../config/index.ts';
import { Vector2D, background, drawTextWithFont } from '../utils/index.ts';


interface GraphOptions {
  bar_width:    number,
  bar_spacing:  number,

  graphSegments_Y: number,
  graphSegments_X: number,
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
      bar_width:    config && config.bar_width   || 10,
      bar_spacing:  config && config.bar_spacing || 5,

      graphSegments_X: config && config.graphSegments_X || 10,
      graphSegments_Y: config && config.graphSegments_Y || 10,
    }

    console.log('Create Graph with Options:', this._options);
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
    ctx.fillText('X-Axis', (WIDTH / 2) - 10, (HEIGHT - this.y_offset / 2) + 10);

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

  private _draw_graph_segments() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { graphSegments_X, graphSegments_Y } = this._options;

    // Y-Axis Segmentations
    ctx.fillStyle = '#ECF0F1';

    const Y_SEGMENTS = HEIGHT / graphSegments_Y;
    for (let i = 0; i < graphSegments_Y - 1; i++) {
      const Y = (HEIGHT - (Y_SEGMENTS * i)) - this.y_padding;
      
      ctx.beginPath();
      ctx.arc(
        this.x_padding, 
        Y,
        2,
        0, Math.PI * 2,
      );
      ctx.closePath();
      ctx.fill();

      // X Value Text (Index)
      ctx.fillText((HEIGHT - this.y_padding - Y).toString(), this.x_padding - 20, Y);
    }

    // X-Axis Segmentations
    const X_SEGMENTS = (WIDTH - this.x_padding) / graphSegments_X;
    for (let i = 0; i < graphSegments_X - 1; i++) {
      const X = this.x_padding + X_SEGMENTS * i;

      ctx.beginPath();
      ctx.arc(
        X, 
        HEIGHT - this.y_padding,
        2,
        0, Math.PI * 2,
      );
      ctx.closePath();
      ctx.fill();

      // X Value Text (Index)
      ctx.fillText(i.toString(), X, HEIGHT - this.y_offset + 12);
    }
  }

  private _draw_bars() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { bar_width, graphSegments_X } = this._options;
    
    ctx.save();

    // Space out each Entry to given Segments
    const X_SEGMENTS = (WIDTH - this.x_padding) / graphSegments_X;
    for (let i = 0; i < graphSegments_X; i++) {
      // Constrain to # of entries
      if (i >= this._entries.length)
        break;
      
      const entry = this._entries[i];
      const { y } = entry.position;
      
      ctx.fillStyle = entry.color;
      ctx.beginPath();
      
      const X = this.x_padding + X_SEGMENTS * i;
      ctx.fillRect(
        X,
        HEIGHT - this.y_offset - y,
        bar_width, 
        y,
      );
      ctx.closePath();

      // Y Value text (Value)
      ctx.fillText(y.toString(), X + 5, HEIGHT - this.y_offset - y - 10);
    }
    
    ctx.restore();
  }
  
  public draw() {
    background(50, 50, 50, 0.5);
    
    this._draw_bars();
    this._draw_graph_outline();
    this._draw_graph_segments();
  }

};