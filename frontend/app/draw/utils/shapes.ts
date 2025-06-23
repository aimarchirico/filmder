import * as polygonClipping from "polygon-clipping";
import { Shape, BoundingBox, MergeResult } from "../types";

/**
 * Converts a shape to a polygon format that polygon-clipping library can use
 */
export const toPolygon = (shape: Shape): any => {
  if ('points' in shape) {
    // It's already a polygon-like shape
    const points = [...shape.points];
    const polygon = [];
    for (let i = 0; i < points.length; i += 2) {
      polygon.push([points[i] + shape.x, points[i + 1] + shape.y]);
    }
    return [[polygon]];
  }
  
  // It's a rectangle - convert to polygon points
  const { x, y, width, height } = shape;
  return [[
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
    [x, y] // Close the polygon
  ]];
};

/**
 * Converts a polygon from polygon-clipping format back to our Shape format
 */
export const fromPolygon = (polygon: any, originalShape: Shape): Shape => {
  // Ensure we're working with the actual polygon points
  const polyPoints = polygon[0];
  
  // Extract all x and y coordinates to find minimum values
  const allX = polyPoints.map((point: number[]) => point[0]);
  const allY = polyPoints.map((point: number[]) => point[1]);
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  
  // Create the points array for Konva.Line relative to the minX, minY
  const points = polyPoints.flatMap((point: number[]) => [
    point[0] - minX, point[1] - minY
  ]);
  
  return {
    id: `poly-${Date.now()}`,
    x: minX,
    y: minY,
    points,
    fill: originalShape.fill,
    draggable: true,
    type: 'polygon'
  };
};

/**
 * Gets the bounding box of a shape
 */
export const getBoundingBox = (shape: Shape): BoundingBox => {
  if (!('points' in shape)) {
    return {
      x1: shape.x,
      y1: shape.y,
      x2: shape.x + shape.width,
      y2: shape.y + shape.height
    };
  }
  
  const points = shape.points;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (let i = 0; i < points.length; i += 2) {
    const x = points[i] + shape.x;
    const y = points[i + 1] + shape.y;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  
  return {
    x1: minX,
    y1: minY,
    x2: maxX,
    y2: maxY
  };
};

/**
 * Checks if two shapes intersect
 */
export const doShapesIntersect = (shape1: Shape, shape2: Shape): boolean => {
  // First do a quick bounding box check for all shape types
  const r1 = getBoundingBox(shape1);
  const r2 = getBoundingBox(shape2);
  
  // If bounding boxes don't overlap, shapes definitely don't intersect
  if (
    r2.x1 >= r1.x2 || 
    r2.x2 <= r1.x1 || 
    r2.y1 >= r1.y2 || 
    r2.y2 <= r1.y1
  ) {
    return false;
  }
  
  // For more detailed intersection check, use polygon-clipping
  try {
    const poly1 = toPolygon(shape1);
    const poly2 = toPolygon(shape2);
    
    // Calculate the intersection between the two shapes
    const intersection = polygonClipping.intersection(poly1 as any, poly2 as any);
    
    // Check if there's any content in the intersection
    return intersection.length > 0 && 
           intersection[0].length > 0 && 
           intersection[0][0].length > 0;
  } catch (error) {
    console.error("Error checking intersection:", error);
    return false;
  }
};

/**
 * Finds connected components (shapes that should be merged)
 */
export const findConnectedComponents = (shapes: Shape[]): number[][] => {
  const n = shapes.length;
  const visited = new Array(n).fill(false);
  const components: number[][] = [];
  
  // DFS to find connected components
  const dfs = (vertex: number, component: number[]) => {
    visited[vertex] = true;
    component.push(vertex);
    
    for (let i = 0; i < n; i++) {
      if (!visited[i] && doShapesIntersect(shapes[vertex], shapes[i])) {
        dfs(i, component);
      }
    }
  };
  
  // Find all connected components
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const component: number[] = [];
      dfs(i, component);
      components.push(component);
    }
  }
  
  return components;
};

/**
 * Merges overlapping shapes
 */
export const mergeOverlappingShapes = (currentShapes: Shape[]): MergeResult => {
  // Find groups of shapes that should be merged
  const components = findConnectedComponents(currentShapes);
  const resultShapes: Shape[] = [];
  
  // Process each component
  for (const component of components) {
    if (component.length === 1) {
      // Single shape, no merging needed
      resultShapes.push(currentShapes[component[0]]);
    } else {
      // Multiple shapes to merge
      try {
        // Start with the first shape in the component
        let mergedShape = currentShapes[component[0]];
        
        // Merge with each other shape in the component
        for (let i = 1; i < component.length; i++) {
          const nextShape = currentShapes[component[i]];
          const poly1 = toPolygon(mergedShape);
          const poly2 = toPolygon(nextShape);
          const unionResult = polygonClipping.union(poly1 as any, poly2 as any);
          
          if (unionResult.length > 0) {
            mergedShape = fromPolygon(unionResult[0], mergedShape);
          }
        }
        
        resultShapes.push(mergedShape);
      } catch (error) {
        console.error("Error merging shapes in component:", error);
        // If there's an error, just add the shapes individually
        component.forEach(idx => resultShapes.push(currentShapes[idx]));
      }
    }
  }
  
  // Check if any merging happened
  const merged = resultShapes.length < currentShapes.length;
  
  return { shapes: resultShapes, merged };
};
