"use client";
import { useState } from "react";
import Konva from "konva";
import { Shape, RectangleShape, LineShape, Point } from "../types";
import { doShapesIntersect, mergeOverlappingShapes } from "../utils/shapes";

export const useShapes = (viewMode: 'draw' | 'zone') => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<RectangleShape | null>(null);
  const [currentLine, setCurrentLine] = useState<LineShape | null>(null);
  const [drawingTool, setDrawingTool] = useState<'rectangle' | 'line'>('rectangle');

  const handleMouseDown = (e: any) => {
    if (viewMode === 'zone') return;
    if (e.target !== e.target.getStage()) {
      return;
    }
    
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    
    setStartPoint({ x: pos.x, y: pos.y });
    setIsDrawing(true);
    
    if (drawingTool === 'rectangle') {
      setCurrentRect({
        id: `rect-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: Konva.Util.getRandomColor(),
        draggable: true,
        type: 'rectangle',
      });
    } else {
      setCurrentLine({
        id: `line-${Date.now()}`,
        x: 0,
        y: 0,
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: '#000000',
        strokeWidth: 5,
        draggable: true,
        fill: 'transparent',
        type: 'line',
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (viewMode === 'zone' || !isDrawing) return;
    
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    
    if (drawingTool === 'rectangle' && currentRect) {
      setCurrentRect({
        ...currentRect,
        width: pos.x - startPoint.x,
        height: pos.y - startPoint.y,
      });
    } else if (drawingTool === 'line' && currentLine) {
      const dx = Math.abs(pos.x - startPoint.x);
      const dy = Math.abs(pos.y - startPoint.y);
      
      if (dx > dy) {
        setCurrentLine({
          ...currentLine,
          points: [startPoint.x, startPoint.y, pos.x, startPoint.y],
        });
      } else {
        setCurrentLine({
          ...currentLine,
          points: [startPoint.x, startPoint.y, startPoint.x, pos.y],
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (viewMode === 'zone' || !isDrawing) return;
    setIsDrawing(false);
    
    if (drawingTool === 'rectangle' && currentRect) {
      const normalizedRect: RectangleShape = {
        ...currentRect,
        x: currentRect.width < 0 ? currentRect.x + currentRect.width : currentRect.x,
        y: currentRect.height < 0 ? currentRect.y + currentRect.height : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
      };
      
      if (normalizedRect.width > 5 && normalizedRect.height > 5) {
        let hasOverlap = false;
        let overlappingIndices: number[] = [];
        
        shapes.forEach((shape, index) => {
          if (doShapesIntersect(normalizedRect, shape)) {
            hasOverlap = true;
            overlappingIndices.push(index);
          }
        });
        
        if (hasOverlap) {
          const shapesToMerge: Shape[] = [normalizedRect, ...overlappingIndices.map(index => shapes[index])];
          const remainingShapes = shapes.filter((_, index) => !overlappingIndices.includes(index));
          const { shapes: mergedShapes } = mergeOverlappingShapes(shapesToMerge);
          setShapes([...remainingShapes, ...mergedShapes]);
        } else {
          setShapes([...shapes, normalizedRect]);
        }
      }
      
      setCurrentRect(null);
    } else if (drawingTool === 'line' && currentLine) {
      const [x1, y1, x2, y2] = currentLine.points;
      const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      if (lineLength > 5) {
        setShapes([...shapes, currentLine]);
      }
      
      setCurrentLine(null);
    }
  };

  const handleDragEnd = (e: any, index: number) => {
    if (viewMode === 'zone') return;

    const draggedShape: Shape = {
      ...shapes[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    
    let hasOverlap = false;
    let overlappingIndices: number[] = [];
    
    shapes.forEach((shape, i) => {
      if (i !== index && doShapesIntersect(draggedShape, shape)) {
        hasOverlap = true;
        overlappingIndices.push(i);
      }
    });
    
    if (hasOverlap) {
      const shapesToMerge: Shape[] = [draggedShape, ...overlappingIndices.map(i => shapes[i])];
      const remainingShapes = shapes.filter((_, i) => !overlappingIndices.includes(i) && i !== index);
      const { shapes: mergedShapes } = mergeOverlappingShapes(shapesToMerge);
      setShapes([...remainingShapes, ...mergedShapes]);
    } else {
      const updatedShapes = [...shapes];
      updatedShapes[index] = draggedShape;
      setShapes(updatedShapes);
    }
  };

  const handleClear = () => {
    setShapes([]);
    setCurrentRect(null);
    setCurrentLine(null);
    setIsDrawing(false);
  };

  return {
    shapes,
    setShapes,
    drawingTool,
    setDrawingTool,
    currentRect,
    currentLine,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDragEnd,
    handleClear,
  };
};
