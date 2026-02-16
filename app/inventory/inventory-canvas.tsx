"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { inventoryItems, InventoryItem } from "../util/inventory";
import { useZenNavigation } from "../components/inventory-shortcut";

export default function InventoryCanvas() {
  const zenNavigate = useZenNavigation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Handle Escape key to exit (I key is handled by global InventoryShortcut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        zenNavigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zenNavigate]);

  // Mouse down - start dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start drag on left click and on the canvas itself
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    },
    [offset]
  );

  // Mouse move - pan canvas
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Update tooltip position
      setTooltipPosition({ x: e.clientX, y: e.clientY });

      if (!isDragging) return;
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  // Mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle item click
  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: InventoryItem) => {
      // Only open link if we weren't dragging
      if (!isDragging) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      }
      e.stopPropagation();
    },
    [isDragging]
  );

  // Track if we moved during drag to prevent click after drag
  const [hasMoved, setHasMoved] = useState(false);
  const moveThreshold = 5;

  const handleMouseMoveWithThreshold = useCallback(
    (e: React.MouseEvent) => {
      setTooltipPosition({ x: e.clientX, y: e.clientY });

      if (!isDragging) return;

      const dx = Math.abs(e.clientX - dragStart.x - offset.x);
      const dy = Math.abs(e.clientY - dragStart.y - offset.y);

      if (dx > moveThreshold || dy > moveThreshold) {
        setHasMoved(true);
      }

      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart, offset]
  );

  const handleMouseDownWithReset = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setHasMoved(false);
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    },
    [offset]
  );

  const handleItemClickSafe = useCallback(
    (e: React.MouseEvent, item: InventoryItem) => {
      if (!hasMoved) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      }
      e.stopPropagation();
    },
    [hasMoved]
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-neutral-100 overflow-hidden select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDownWithReset}
      onMouseMove={handleMouseMoveWithThreshold}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas content */}
      <div
        className="absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          willChange: "transform",
        }}
      >
        {inventoryItems.map((item) => (
          <div
            key={item.id}
            className="absolute group"
            style={{
              left: item.position.x,
              top: item.position.y,
              width: item.size?.width || 150,
            }}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={(e) => handleItemClickSafe(e, item)}
          >
            {/* Item image */}
            <div
              className="relative transition-transform duration-200 group-hover:scale-105"
              style={{
                width: item.size?.width || 150,
                height: item.size?.height || 150,
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain pointer-events-none"
                draggable={false}
              />
            </div>
            {/* Item label */}
            <div className="mt-2 flex justify-center">
              <span className="px-3 py-1.5 bg-white rounded-full text-sm text-neutral-800 shadow-sm border border-neutral-200 whitespace-nowrap">
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredItem && !isDragging && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x + 16,
            top: tooltipPosition.y + 16,
          }}
        >
          <div className="bg-neutral-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs shadow-lg">
            <p className="font-medium">{hoveredItem.name}</p>
            <p className="text-neutral-400 text-xs mt-0.5">
              {hoveredItem.description}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-neutral-600 shadow-sm border border-neutral-200">
          Drag to explore • Click items to learn more • Press{" "}
          <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono">
            I
          </kbd>{" "}
          or{" "}
          <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono">
            Esc
          </kbd>{" "}
          to exit
        </div>
      </div>

      {/* Title */}
      <div className="fixed top-6 left-6 z-40">
        <h1 className="text-xl font-medium text-neutral-900">My Inventory</h1>
        <p className="text-sm text-neutral-500">Things I use and love</p>
      </div>
    </div>
  );
}
