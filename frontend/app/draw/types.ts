// Shape types for our drawing application
export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BaseShape {
  id: string;
  x: number;
  y: number;
  fill: string;
  draggable: boolean;
  type: string;
}

export interface RectangleShape extends BaseShape {
  width: number;
  height: number;
  type: 'rectangle';
}

export interface PolygonShape extends BaseShape {
  points: number[];
  type: 'polygon';
}

export interface LineShape extends BaseShape {
  points: number[];
  stroke: string;
  strokeWidth: number;
  type: 'line';
}

export type Shape = RectangleShape | PolygonShape | LineShape;

export interface MergeResult {
  shapes: Shape[];
  merged: boolean;
}
