"use client";
import { useState } from "react";
import { Shape } from "../types";

export const useZoneView = () => {
  const [viewMode, setViewMode] = useState<'draw' | 'zone'>('draw');
  const [selectedZone, setSelectedZone] = useState<Shape | null>(null);
  const [chairs, setChairs] = useState<{zoneId: string, chairs: {x: number, y: number}[]}[]>([]);

  const handleZoneSelect = (shape: Shape) => {
    if (viewMode === 'zone') {
      setSelectedZone(shape);
      if (!chairs.find(c => c.zoneId === shape.id)) {
        setChairs([...chairs, { zoneId: shape.id, chairs: [] }]);
      }
    }
  };

  const handleAddChair = (e: any) => {
    if (viewMode !== 'zone' || !selectedZone) return;
    
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    
    if (!pointerPos) return;
    
    const chairsInZone = chairs.find(c => c.zoneId === selectedZone.id)?.chairs || [];
    const chairSize = 20;
    const isOverExistingChair = chairsInZone.some(chair => {
      return (
        Math.abs(chair.x - pointerPos.x) < chairSize &&
        Math.abs(chair.y - pointerPos.y) < chairSize
      );
    });
    
    if (isOverExistingChair) {
      return;
    }
    
    const updatedChairs = chairs.map(zoneChairs => {
      if (zoneChairs.zoneId === selectedZone.id) {
        return {
          ...zoneChairs,
          chairs: [...zoneChairs.chairs, { 
            x: pointerPos.x, 
            y: pointerPos.y 
          }]
        };
      }
      return zoneChairs;
    });
    
    setChairs(updatedChairs);
  };

  const handleChairDragEnd = (e: any, chairIndex: number) => {
    if (!selectedZone) return;
    
    const newX = e.target.x();
    const newY = e.target.y();
    
    const updatedChairs = chairs.map(zoneChairs => {
      if (zoneChairs.zoneId === selectedZone.id) {
        const updatedZoneChairs = [...zoneChairs.chairs];
        updatedZoneChairs[chairIndex] = { 
          x: newX, 
          y: newY 
        };
        return {
          ...zoneChairs,
          chairs: updatedZoneChairs
        };
      }
      return zoneChairs;
    });
    
    setChairs(updatedChairs);
  };

  const handleChairRightClick = (e: any, chairIndex: number) => {
    e.evt.preventDefault();
    
    if (!selectedZone) return;
    
    const updatedChairs = chairs.map(zoneChairs => {
      if (zoneChairs.zoneId === selectedZone.id) {
        const updatedZoneChairs = [...zoneChairs.chairs];
        updatedZoneChairs.splice(chairIndex, 1);
        return {
          ...zoneChairs,
          chairs: updatedZoneChairs
        };
      }
      return zoneChairs;
    });
    
    setChairs(updatedChairs);
  };

  const exitZoneView = () => {
    setViewMode('draw');
    setSelectedZone(null);
  };

  return {
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
  };
};
