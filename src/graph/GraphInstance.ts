import { CanvasInstance } from '../config/index.ts';
import { Vector2D, normalize, max, background, drawTextWithFont } from '../utils/index.ts';


interface GraphOptions {
  titleText: string,
  xAxisText: string,
  yAxisText: string,

  yMax:         number,
  
  bar_width:    number,
  bar_spacing:  number,

  graphSegments_Y: number,
  graphSegments_X: number,

  titleColor: string,
  xTextColor: string,
  yTextColor: string,

  xSegmentColor: string,
  ySegmentColor: string,
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

  
  constructor(config?: Partial<GraphOptions>) {
    const { HEIGHT } = CanvasInstance;
    
    // Setup Default Segments & Max Values
    const graphSegments_Y = 10;
    const yMax = (HEIGHT / graphSegments_Y) * (graphSegments_Y - 2);
    
    // Configure Graph
    this._options = {
      titleText: config && config.titleText || 'title',
      xAxisText: config && config.xAxisText || 'X-Axis',
      yAxisText: config && config.yAxisText || 'Y-Axis',

      yMax: config && config.yMax || yMax,
      
      bar_width:    config && config.bar_width   || 10,
      bar_spacing:  config && config.bar_spacing || 5,

      graphSegments_X: config && config.graphSegments_X || 10,
      graphSegments_Y: config && config.graphSegments_Y || graphSegments_Y,

      titleColor: config && config.titleColor || 'rgb(255,255,255)',
      xTextColor: config && config.xTextColor || 'rgb(255,255,255)',
      yTextColor: config && config.yTextColor || 'rgb(255,255,255)',
      
      xSegmentColor: config && config.xSegmentColor || 'rgb(255,255,255)',
      ySegmentColor: config && config.ySegmentColor || 'rgb(255,255,255)',
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
    ctx.strokeStyle = this._options.titleColor;
    ctx.fillStyle = this._options.titleColor;
    ctx.lineWidth = 1.5;

    // Graph Title
    drawTextWithFont(this._options.titleText, (WIDTH / 2) - 30, this.y_offset, '12pt Cochin');

    // X-Axis
    ctx.strokeStyle = this._options.xTextColor;
    ctx.fillStyle = this._options.xTextColor;
    ctx.fillText(this._options.xAxisText, (WIDTH / 2) - 10, (HEIGHT - this.y_offset / 2) + 10);

    ctx.beginPath();
    ctx.lineTo(this.x_padding, HEIGHT - this.y_padding);
    ctx.lineTo(this.x_padding, this.y_padding);
    ctx.stroke();
    ctx.closePath();

    // Y-Axis
    ctx.strokeStyle = this._options.yTextColor;
    ctx.fillStyle = this._options.yTextColor;
    ctx.fillText(this._options.yAxisText, (this.x_offset / 2) - 8, (HEIGHT / 2));

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
    const Y_SEGMENTS = HEIGHT / graphSegments_Y;
    const maxY_segment = Y_SEGMENTS * (graphSegments_Y - 2);
    
    for (let i = 0; i < graphSegments_Y - 1; i++) {
      const Y = (HEIGHT - (Y_SEGMENTS * i)) - this.y_padding;
      
      ctx.fillStyle = '#ECF0F1';
      ctx.strokeStyle = '#ECF0F1';
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
      ctx.fillStyle = this._options.ySegmentColor;
      ctx.strokeStyle = this._options.ySegmentColor;

      const normalized = normalize((HEIGHT - this.y_padding - Y), 0, maxY_segment);
      const yVal = normalized * this._options.yMax;
      ctx.fillText(
        yVal.toString(),
        this.x_padding - ((yVal % 1 === 0) ? 25 :35),
        Y,
      );
    }

    // X-Axis Segmentations
    const X_SEGMENTS = (WIDTH - this.x_padding) / graphSegments_X;
    for (let i = 0; i < graphSegments_X - 1; i++) {
      const X = this.x_padding + X_SEGMENTS * i;

      ctx.fillStyle = '#ECF0F1';
      ctx.strokeStyle = '#ECF0F1';
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
      ctx.fillStyle = this._options.xSegmentColor;
      ctx.strokeStyle = this._options.xSegmentColor;
      ctx.fillText(i.toString(), X, HEIGHT - this.y_offset + 12);
    }
  }

  private _draw_bars() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { bar_width, graphSegments_X, graphSegments_Y } = this._options;
    
    ctx.save();

    // Find max bar value to map based on yMax
    const Y_SEGMENTS = HEIGHT / graphSegments_Y;
    const maxY_segment = Y_SEGMENTS * (graphSegments_Y - 2);
    const maxBarValue = max(this._entries.map(elt => elt.position.y));
    
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
      
      // Max X & Y Points
      const X = this.x_padding + X_SEGMENTS * i;
      const Y = normalize(y, 0, maxBarValue) * maxY_segment;
      
      ctx.fillRect(
        X,
        HEIGHT - this.y_offset - Y,
        bar_width, 
        Y,
      );
      ctx.closePath();

      // Y Value text (Value)
      ctx.fillText(y.toString(), X + 5, HEIGHT - this.y_offset - Y - 10);
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