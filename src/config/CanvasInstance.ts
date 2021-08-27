import Canvas, { 
  EmulatedCanvas2D,
  CanvasRenderingContext2D,
} from 'https://deno.land/x/canvas@v1.2.2/mod.ts'


export class CanvasInstance {
  // CANVAS API INSTANCES
  private static _canvas: EmulatedCanvas2D | null      = null;
  private static _ctx: CanvasRenderingContext2D | null = null;

  // CANVAS CONFIGURATION
  private static _WIDTH:  number = 200;     // Default 200
  private static _HEIGHT: number = 200;     // Default 200
  
  private constructor() {}

  /**
   * Instantiates a Canvas Instance
   * @param width Canvas Width
   * @param height Canvas Height
   * @returns 
   */
  public static init(width: number, height: number) {
    if (this._canvas === null) {
      this._canvas   = Canvas.MakeCanvas(width, height);
      this._ctx      = this._canvas.getContext('2d');
      this._WIDTH   = width;
      this._HEIGHT  = height;
    }
    return this._ctx;
  }
  
  public static get WIDTH(): number {
    return this._WIDTH;
  }
  public static get HEIGHT(): number {
    return this._HEIGHT;
  }

  public static get canvas(): EmulatedCanvas2D {
    if (this._canvas === null) this.init(200, 200);
    return this._canvas as EmulatedCanvas2D;
  }

  public static get ctx(): CanvasRenderingContext2D {
    if (this._ctx === null) this.init(200, 200);
    return this._ctx as CanvasRenderingContext2D;
  }
};