"use client";
import React from 'react';

interface ToolbarProps {
  viewMode: 'draw' | 'zone';
  drawingTool: 'rectangle' | 'line';
  backgroundImage: HTMLImageElement | null;
  selectedZone: any;
  setViewMode: (mode: 'draw' | 'zone') => void;
  setDrawingTool: (tool: 'rectangle' | 'line') => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBackgroundImage: () => void;
  handleClear: () => void;
  exitZoneView: () => void;
  setSelectedZone: (zone: any) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  drawingTool,
  backgroundImage,
  selectedZone,
  setViewMode,
  setDrawingTool,
  handleImageUpload,
  removeBackgroundImage,
  handleClear,
  exitZoneView,
  setSelectedZone
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      <div className="flex gap-2">
        <button 
          onClick={() => {
            setViewMode('draw');
            setSelectedZone(null);
          }}
          className={`px-4 py-2 rounded ${
            viewMode === 'draw' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Draw Mode
        </button>
        <button 
          onClick={() => setViewMode('zone')}
          className={`px-4 py-2 rounded ${
            viewMode === 'zone' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          View Zone
        </button>
      </div>
      
      {viewMode === 'draw' && (
        <>
          <div className="flex gap-2">
            <button 
              onClick={() => setDrawingTool('rectangle')}
              className={`px-4 py-2 rounded ${
                drawingTool === 'rectangle' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              Rectangle
            </button>
            <button 
              onClick={() => setDrawingTool('line')}
              className={`px-4 py-2 rounded ${
                drawingTool === 'line' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              Line
            </button>
          </div>
          
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              Upload Background
            </label>
            
            {backgroundImage && (
              <button
                onClick={removeBackgroundImage}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Remove Background
              </button>
            )}
            
            <button 
              onClick={handleClear} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Canvas
            </button>
          </div>
        </>
      )}
      
      {viewMode === 'zone' && (
        <div className="flex gap-2">
          {selectedZone ? (
            <button
              onClick={exitZoneView}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Exit Zone View
            </button>
          ) : (
            <div className="px-4 py-2 bg-blue-100 rounded">
              Select a zone to add chairs
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
