"use client";
import React, { useRef } from "react";
import { Stage } from "react-konva";
import Konva from "konva";
import { useStage } from "../hooks/useStage";
import { useShapes } from "../hooks/useShapes";
import { useZoneView } from "../hooks/useZoneView";
import Toolbar from "./Toolbar";
import DrawingLayer from "./canvas/DrawingLayer";
import ZoneLayer from "./canvas/ZoneLayer";
import StatusFooter from "./StatusFooter";

interface DrawCanvasProps {
  width?: number;
  height?: number;
}

const DrawCanvas: React.FC<DrawCanvasProps> = ({
  width: initialWidth = 800,
  height: initialHeight = 600
}) => {
  const stageRef = useRef<Konva.Stage>(null);

  const {
    stageDimensions,
    backgroundImage,
    backgroundSize,
    handleImageUpload,
    removeBackgroundImage
  } = useStage(initialWidth, initialHeight);

  const {
    viewMode,
    setViewMode,
    selectedZone,
    setSelectedZone,
    chairs,
    handleZoneSelect,
    handleAddChair,
    handleChairDragEnd,
    handleChairRightClick,
    exitZoneView
  } = useZoneView();

  const {
    shapes,
    drawingTool,
    setDrawingTool,
    currentRect,
    currentLine,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDragEnd,
    handleClear,
  } = useShapes(viewMode);

  const handleCombinedMouseDown = (e: any) => {
    if (viewMode === 'zone' && selectedZone) {
      handleAddChair(e);
    } else {
      handleMouseDown(e);
    }
  };

  const handleCombinedDragEnd = (e: any, index: number) => {
    if (viewMode === 'zone') {
        handleZoneSelect(shapes[index]);
    } else {
        handleDragEnd(e, index);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Toolbar
        viewMode={viewMode}
        drawingTool={drawingTool}
        backgroundImage={backgroundImage}
        selectedZone={selectedZone}
        setViewMode={setViewMode}
        setDrawingTool={setDrawingTool}
        handleImageUpload={handleImageUpload}
        removeBackgroundImage={removeBackgroundImage}
        handleClear={handleClear}
        exitZoneView={exitZoneView}
        setSelectedZone={setSelectedZone}
      />
      
      <div className="border border-gray-300 rounded shadow-md">
        <Stage
          width={stageDimensions.width}
          height={stageDimensions.height}
          onMouseDown={handleCombinedMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          className="bg-white"
        >
          {viewMode === 'draw' || !selectedZone ? (
            <DrawingLayer
              backgroundImage={backgroundImage}
              backgroundSize={backgroundSize}
              stageDimensions={stageDimensions}
              shapes={shapes}
              viewMode={viewMode}
              handleDragEnd={handleCombinedDragEnd}
              handleZoneSelect={(shape) => handleZoneSelect(shape)}
              currentRect={currentRect}
              currentLine={currentLine}
            />
          ) : (
            <ZoneLayer
              selectedZone={selectedZone}
              stageDimensions={stageDimensions}
              chairs={chairs}
              handleChairDragEnd={handleChairDragEnd}
              handleChairRightClick={handleChairRightClick}
            />
          )}
        </Stage>
      </div>
      
      <StatusFooter
        viewMode={viewMode}
        drawingTool={drawingTool}
        backgroundImage={backgroundImage}
        selectedZone={selectedZone}
        chairs={chairs}
      />
    </div>
  );
};

export default DrawCanvas;
