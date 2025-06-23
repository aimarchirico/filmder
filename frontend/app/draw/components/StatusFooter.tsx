"use client";
import React from 'react';

interface StatusFooterProps {
  viewMode: 'draw' | 'zone';
  drawingTool: 'rectangle' | 'line';
  backgroundImage: HTMLImageElement | null;
  selectedZone: any;
  chairs: {zoneId: string, chairs: {x: number, y: number}[]}[];
}

const StatusFooter: React.FC<StatusFooterProps> = ({
  viewMode,
  drawingTool,
  backgroundImage,
  selectedZone,
  chairs
}) => {
  return (
    <div className="mt-2 text-sm text-gray-600">
      {viewMode === 'draw' ? (
        <>
          {drawingTool === 'rectangle' ? 
            "Drawing Rectangle: Click and drag to create a rectangle" : 
            "Drawing Line: Click and drag to create a vertical or horizontal line"}
          {backgroundImage && (
            <div className="mt-1 text-sm text-gray-600">
              Background image loaded. You can draw on top of it.
            </div>
          )}
        </>
      ) : selectedZone ? (
        <div>
          <div className="font-semibold">Zone View Mode</div>
          <div>Click anywhere in the zone to add chairs</div>
          <div>Drag chairs to reposition them</div>
          <div>Right-click a chair to delete it</div>
          <div className="mt-1">
            Chairs placed: {chairs.find(c => c.zoneId === selectedZone.id)?.chairs.length || 0}
          </div>
        </div>
      ) : (
        <div>Select a zone by clicking on it</div>
      )}
    </div>
  );
};

export default StatusFooter;
