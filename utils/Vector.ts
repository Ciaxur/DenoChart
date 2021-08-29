
export class Vector2D {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x(): number { return this._x; }
  public set x(newX: number) { this._x = newX; }

  public get y(): number { return this._y; }
  public set y(newY: number) { this._x = newY; }
};