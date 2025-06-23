"use client";
import React from 'react';
import { Layer, Rect, Line, Image as KonvaImage } from "react-konva";
import { Shape, RectangleShape, LineShape } from '../../types';

interface DrawingLayerProps {
  backgroundImage: HTMLImageElement | null;
  backgroundSize: { width: number; height: number; };
  stageDimensions: { width: number; height: number; };
  shapes: Shape[];
  viewMode: 'draw' | 'zone';
  handleDragEnd: (e: any, index: number) => void;
  handleZoneSelect: (shape: Shape, index: number) => void;
  currentRect: RectangleShape | null;
  currentLine: LineShape | null;
}

const DrawingLayer: React.FC<DrawingLayerProps> = ({
  backgroundImage,
  backgroundSize,
  stageDimensions,
  shapes,
  viewMode,
  handleDragEnd,
  handleZoneSelect,
  currentRect,
  currentLine
}) => {
  return (
    <Layer>
      {backgroundImage && (
        <KonvaImage
          image={backgroundImage}
          width={backgroundSize.width}
          height={backgroundSize.height}
          x={(stageDimensions.width - backgroundSize.width) / 2}
          y={(stageDimensions.height - backgroundSize.height) / 2}
          opacity={0.5}
          listening={false}
        />
      )}
      
      {shapes.map((shape, i) => {
        if (shape.type === 'polygon') {
          return (
            <Line
              key={shape.id}
              x={shape.x}
              y={shape.y}
              points={shape.points}
              closed
              fill={shape.fill}
              draggable={viewMode === 'draw'}
              onDragEnd={(e) => handleDragEnd(e, i)}
              onClick={() => handleZoneSelect(shape, i)}
              stroke={viewMode === 'zone' ? '#3B82F6' : undefined}
              strokeWidth={viewMode === 'zone' ? 3 : undefined}
              opacity={viewMode === 'zone' ? 0.8 : 1}
            />
          );
        } else if (shape.type === 'line') {
          return (
            <Line
              key={shape.id}
              x={shape.x}
              y={shape.y}
              points={shape.points}
              stroke={(shape as LineShape).stroke}
              strokeWidth={(shape as LineShape).strokeWidth}
              draggable={viewMode === 'draw'}
              onDragEnd={(e) => handleDragEnd(e, i)}
              onClick={() => handleZoneSelect(shape, i)}
            />
          );
        } else {
          return (
            <Rect
              key={shape.id}
              x={shape.x}
              y={shape.y}
              width={(shape as RectangleShape).width}
              height={(shape as RectangleShape).height}
              fill={shape.fill}
              draggable={viewMode === 'draw'}
              onDragEnd={(e) => handleDragEnd(e, i)}
              onClick={() => handleZoneSelect(shape, i)}
              stroke={viewMode === 'zone' ? '#3B82F6' : undefined}
              strokeWidth={viewMode === 'zone' ? 3 : undefined}
              opacity={viewMode === 'zone' ? 0.8 : 1}
            />
          );
        }
      })}
      
      {currentRect && (
        <Rect
          x={currentRect.x}
          y={currentRect.y}
          width={currentRect.width}
          height={currentRect.height}
          fill={currentRect.fill}
          opacity={0.5}
        />
      )}
      
      {currentLine && (
        <Line
          points={currentLine.points}
          stroke={currentLine.stroke}
          strokeWidth={currentLine.strokeWidth}
          opacity={0.5}
        />
      )}
    </Layer>
  );
};

export default DrawingLayer;
