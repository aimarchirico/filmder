"use client";
import React from 'react';
import { Layer, Rect, Line } from "react-konva";
import { Shape, RectangleShape, LineShape } from '../../types';

interface ZoneLayerProps {
  selectedZone: Shape;
  stageDimensions: { width: number; height: number; };
  chairs: {zoneId: string, chairs: {x: number, y: number}[]}[];
  handleChairDragEnd: (e: any, chairIndex: number) => void;
  handleChairRightClick: (e: any, chairIndex: number) => void;
}

const ZoneLayer: React.FC<ZoneLayerProps> = ({
  selectedZone,
  stageDimensions,
  chairs,
  handleChairDragEnd,
  handleChairRightClick
}) => {
  return (
    <Layer>
      {selectedZone.type === 'polygon' ? (
        <Line
          points={selectedZone.points}
          closed
          fill={selectedZone.fill}
          x={stageDimensions.width / 2 - 150}
          y={stageDimensions.height / 2 - 150}
          scaleX={2}
          scaleY={2}
          stroke="#000000"
          strokeWidth={2}
        />
      ) : selectedZone.type === 'rectangle' ? (
        <Rect
          x={stageDimensions.width / 2 - (selectedZone as RectangleShape).width}
          y={stageDimensions.height / 2 - (selectedZone as RectangleShape).height}
          width={(selectedZone as RectangleShape).width * 2}
          height={(selectedZone as RectangleShape).height * 2}
          fill={selectedZone.fill}
          stroke="#000000"
          strokeWidth={2}
        />
      ) : (
        <Line
          points={selectedZone.points.map((p, i) => i % 2 === 0 ? p * 2 : p * 2)}
          stroke={(selectedZone as LineShape).stroke}
          strokeWidth={(selectedZone as LineShape).strokeWidth * 2}
          x={stageDimensions.width / 2 - 150}
          y={stageDimensions.height / 2 - 150}
        />
      )}
      
      {chairs.find(c => c.zoneId === selectedZone.id)?.chairs.map((chair, i) => (
        <Rect
          key={`chair-${i}`}
          x={chair.x}
          y={chair.y}
          width={20}
          height={20}
          fill="#8B4513"
          stroke="#000000"
          strokeWidth={1}
          cornerRadius={3}
          draggable={true}
          onDragEnd={(e) => handleChairDragEnd(e, i)}
          onContextMenu={(e) => handleChairRightClick(e, i)}
          onTap={(e) => handleChairRightClick(e, i)}
        />
      ))}
    </Layer>
  );
};

export default ZoneLayer;
