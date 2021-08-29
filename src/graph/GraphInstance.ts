import { CanvasInstance } from '../config/index.ts';
import { Vector2D, normalize, max, background, drawTextWithFont } from '../utils/index.ts';


interface GraphOptions {
  // Canvas Width & Height
  width: number,
  height: number,
  
  // Graph Text
  titleText: string,
  xAxisText: string,
  yAxisText: string,

  // Y-Max Normalized Value
  yMax:         number,

  // Graph Outer-Padding
  yPadding: number,
  xPadding: number,
  
  // Bar Config
  bar_width:    number,
  bar_spacing:  number,

  // Graph Segements
  graphSegments_Y: number,
  graphSegments_X: number,

  // Text Color
  titleColor: string,
  xTextColor: string,
  yTextColor: string,
  
  // Segmentation Color
  xSegmentColor: string,
  ySegmentColor: string,

  // DEBUG: Options
  verbose: boolean,   // Enable/Disable Logging
}

interface BarEntry {
  position: Vector2D,
  color:    string,
}

export class Graph {
  // Graph Offsets
  private _y_offset = 30;
  private _x_offset = 30;
  private _y_padding = 30;
  private _x_padding = 50;

  private _entries: BarEntry[] = [];

  // Graph Configuration
  private _options: GraphOptions;

  
  /**
   * Constructs Graph Configuration
   * @param config (Optional) Graph Configuration
   */
  constructor(config?: Partial<GraphOptions>) {
    const { HEIGHT } = CanvasInstance;
    
    // Setup Default Segments & Max Values
    const graphSegments_Y = 10;
    const yMax = (HEIGHT / graphSegments_Y) * (graphSegments_Y - 2);
    
    // Configure Graph
    this._options = {
      height: config && config.height || 480,
      width: config && config.width || 720,
      
      titleText: config && config.titleText || 'title',
      xAxisText: config && config.xAxisText || 'X-Axis',
      yAxisText: config && config.yAxisText || 'Y-Axis',

      yMax: config && config.yMax || yMax,

      yPadding: config && config.yPadding || 0,
      xPadding: config && config.xPadding || 0,
      
      bar_width:    config && config.bar_width   || 10,
      bar_spacing:  config && config.bar_spacing || 5,

      graphSegments_X: config && config.graphSegments_X || 10,
      graphSegments_Y: config && config.graphSegments_Y || graphSegments_Y,

      titleColor: config && config.titleColor || 'rgb(255,255,255)',
      xTextColor: config && config.xTextColor || 'rgb(255,255,255)',
      yTextColor: config && config.yTextColor || 'rgb(255,255,255)',
      
      xSegmentColor: config && config.xSegmentColor || 'rgb(255,255,255)',
      ySegmentColor: config && config.ySegmentColor || 'rgb(255,255,255)',

      verbose: config && config.verbose || false,
    }

    // Apply Graph Padding
    this._x_padding += this._options.xPadding;
    this._y_padding += this._options.yPadding;
    this._x_offset += this._options.xPadding;
    this._y_offset += this._options.yPadding;

    // Initialize Canvas Instance if have NOT already
    if (!CanvasInstance.ready()) {
      CanvasInstance.init(this._options.width, this._options.height);

      if (this._options.verbose)
        console.log(`Initialized Canvas Instance W[${this._options.width}] H[${this._options.height}]`);
    }

    if (this._options.verbose)
      console.log('Create Graph with Options:', this._options);
  }

  /**
   * Adds given Bar entry to Graph
   * @param entry Entry to add to graph
   */
  public add(entry: BarEntry): void {
    this._entries.push(entry);
  }
  
  /**
   * Internal: Draws Graph outline
   */
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
    drawTextWithFont(this._options.titleText, (WIDTH / 2) - 30, this._y_offset, '12pt Cochin');

    // X-Axis
    ctx.strokeStyle = this._options.xTextColor;
    ctx.fillStyle = this._options.xTextColor;
    ctx.fillText(this._options.xAxisText, (WIDTH / 2) - 10, (HEIGHT - this._y_offset / 2) + 10);

    ctx.beginPath();
    ctx.lineTo(this._x_padding, HEIGHT - this._y_padding);
    ctx.lineTo(this._x_padding, this._y_padding);
    ctx.stroke();
    ctx.closePath();

    // Y-Axis
    ctx.strokeStyle = this._options.yTextColor;
    ctx.fillStyle = this._options.yTextColor;
    ctx.fillText(this._options.yAxisText, (this._x_offset / 2) - 8, (HEIGHT / 2));

    ctx.beginPath();
    ctx.lineTo(this._x_padding, HEIGHT - this._y_padding);
    ctx.lineTo(WIDTH - this._x_padding, HEIGHT - this._y_padding);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  /**
   * Internal: Draws graph segments
   */
  private _draw_graph_segments() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { graphSegments_X, graphSegments_Y } = this._options;

    // Y-Axis Segmentations
    const Y_SEGMENTS = HEIGHT / graphSegments_Y;
    const maxY_segment = Y_SEGMENTS * (graphSegments_Y - 2);
    
    for (let i = 0; i < graphSegments_Y - 1; i++) {
      const Y = (HEIGHT - (Y_SEGMENTS * i)) - this._y_padding;
      
      ctx.fillStyle = '#ECF0F1';
      ctx.strokeStyle = '#ECF0F1';
      ctx.beginPath();
      ctx.arc(
        this._x_padding, 
        Y,
        2,
        0, Math.PI * 2,
      );
      ctx.closePath();
      ctx.fill();

      // X Value Text (Index)
      ctx.fillStyle = this._options.ySegmentColor;
      ctx.strokeStyle = this._options.ySegmentColor;

      const normalized = normalize((HEIGHT - this._y_padding - Y), 0, maxY_segment);
      const yVal = normalized * this._options.yMax;
      ctx.fillText(
        yVal.toString(),
        this._x_padding - ((yVal % 1 === 0) ? 25 :35),
        Y,
      );
    }

    // X-Axis Segmentations
    const X_SEGMENTS = (WIDTH - this._x_padding) / graphSegments_X;
    for (let i = 0; i < graphSegments_X - 1; i++) {
      const X = this._x_padding + X_SEGMENTS * i;

      ctx.fillStyle = '#ECF0F1';
      ctx.strokeStyle = '#ECF0F1';
      ctx.beginPath();
      ctx.arc(
        X, 
        HEIGHT - this._y_padding,
        2,
        0, Math.PI * 2,
      );
      ctx.closePath();
      ctx.fill();

      // X Value Text (Index)
      ctx.fillStyle = this._options.xSegmentColor;
      ctx.strokeStyle = this._options.xSegmentColor;
      ctx.fillText(i.toString(), X, HEIGHT - this._y_offset + 12);
    }
  }

  /**
   * Internal: Draws graph bar entries
   */
  private _draw_bars() {
    const { ctx, HEIGHT, WIDTH } = CanvasInstance;
    const { bar_width, graphSegments_X, graphSegments_Y } = this._options;
    
    ctx.save();

    // Find max bar value to map based on yMax
    const Y_SEGMENTS = HEIGHT / graphSegments_Y;
    const maxY_segment = Y_SEGMENTS * (graphSegments_Y - 2);
    const maxBarValue = max(this._entries.map(elt => elt.position.y));
    
    // Space out each Entry to given Segments
    const X_SEGMENTS = (WIDTH - this._x_padding) / graphSegments_X;
    for (let i = 0; i < graphSegments_X; i++) {
      // Constrain to # of entries
      if (i >= this._entries.length)
        break;
      
      const entry = this._entries[i];
      const { y } = entry.position;
      
      ctx.fillStyle = entry.color;
      ctx.beginPath();
      
      // Max X & Y Points
      const X = this._x_padding + X_SEGMENTS * i;
      const Y = normalize(y, 0, maxBarValue) * maxY_segment;
      
      ctx.fillRect(
        X,
        HEIGHT - this._y_offset - Y,
        bar_width, 
        Y,
      );
      ctx.closePath();

      // Y Value text (Value)
      ctx.fillText(y.toString(), X + 5, HEIGHT - this._y_offset - Y - 10);
    }
    
    ctx.restore();
  }
  
  /**
   * Draws graph with entries to Canvas Context
   */
  public draw() {
    background(50, 50, 50, 0.5);
    
    this._draw_bars();
    this._draw_graph_outline();
    this._draw_graph_segments();
  }

  /**
   * Saves graph as png to given path
   * @param imagePath Path of image to save to
   */
  public save(imagePath: string) {
    const { canvas } = CanvasInstance;
    const imageBuffer = canvas.toBuffer();
    Deno.writeFileSync(imagePath, imageBuffer);

    if (this._options.verbose)
      console.log(`Graph save to '${imagePath}'`);
  }
  
};