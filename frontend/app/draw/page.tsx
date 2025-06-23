"use client";
import React from "react";
import PageContainer from "@/components/PageContainer";
import DrawCanvas from "./components/DrawCanvas";

const DrawPage = () => {
  return (
    <PageContainer title="Drawing Tool">
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Interactive Drawing Tool</h1>
        <div className="bg-blue-200 rounded-md p-4 mb-6 w-full">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Select a tool (Rectangle or Line) to begin drawing</li>
            <li>Click and drag to create shapes</li>
            <li>Lines can only be drawn horizontally or vertically</li>
            <li>Drag shapes to move them</li>
            <li>Overlapping rectangles will automatically merge into complex shapes</li>
            <li>Upload a background image (e.g., floor plan) to draw on top of it</li>
          </ul>
        </div>
        
        <DrawCanvas />
      </div>
    </PageContainer>
  );
};

export default DrawPage;
