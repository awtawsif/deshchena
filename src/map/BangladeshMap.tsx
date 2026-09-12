import React, { useMemo, useState, useRef, useCallback } from 'react';
import { DISTRICT_PATHS, MAP_WIDTH, MAP_HEIGHT } from './paths';
import { DistrictPath } from './DistrictPath';
import { BangladeshMapProps, DistrictVisualState } from './types';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

export const BangladeshMap: React.FC<BangladeshMapProps> = ({
  districtStates = {},
  selectedDistrictId,
  highlightDivisionId,
  onDistrictClick,
  onDistrictHover,
  showLabels = false,
  showHoverNames = true,
  language = 'en',
  disabled = false,
  className = '',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number }>({
    mouseX: 0,
    mouseY: 0,
    panX: 0,
    panY: 0,
  });
  const dragDistanceRef = useRef<number>(0);
  const touchStartRef = useRef<{
    dist: number;
    zoom: number;
    panX: number;
    panY: number;
    mouseX?: number;
    mouseY?: number;
  } | null>(null);

  const clampPan = useCallback((x: number, y: number, currentZoom: number) => {
    const vW = MAP_WIDTH / currentZoom;
    const vH = MAP_HEIGHT / currentZoom;
    const maxX = (MAP_WIDTH - vW) / 2;
    const maxY = (MAP_HEIGHT - vH) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => {
      const next = Math.min(4.0, parseFloat((prev + 0.5).toFixed(1)));
      setPan((p) => clampPan(p.x, p.y, next));
      return next;
    });
  }, [clampPan]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(1.0, parseFloat((prev - 0.5).toFixed(1)));
      if (next === 1.0) {
        setPan({ x: 0, y: 0 });
      } else {
        setPan((p) => clampPan(p.x, p.y, next));
      }
      return next;
    });
  }, [clampPan]);

  const handleResetZoom = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Middle click (button 1) or Left click with Alt/Shift key
    if (e.button === 1 || (e.button === 0 && (e.altKey || e.shiftKey))) {
      e.preventDefault();
      setIsPanning(true);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      dragDistanceRef.current = 0;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !containerRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    dragDistanceRef.current += Math.hypot(dx, dy);

    const rect = containerRef.current.getBoundingClientRect();
    const svgDx = (dx / rect.width) * MAP_WIDTH;
    const svgDy = (dy / rect.height) * MAP_HEIGHT;

    const newPan = clampPan(
      dragStartRef.current.panX - svgDx,
      dragStartRef.current.panY - svgDy,
      zoom
    );
    setPan(newPan);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1 || isPanning) {
      setIsPanning(false);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom on wheel scroll
    if (e.deltaY < 0) {
      handleZoomIn();
    } else if (e.deltaY > 0) {
      handleZoomOut();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { dist, zoom, panX: pan.x, panY: pan.y };
    } else if (e.touches.length === 1 && zoom > 1.0) {
      touchStartRef.current = {
        dist: 0,
        zoom,
        panX: pan.x,
        panY: pan.y,
        mouseX: e.touches[0].clientX,
        mouseY: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartRef.current.dist > 0) {
        const scale = dist / touchStartRef.current.dist;
        const newZoom = Math.max(1.0, Math.min(4.0, parseFloat((touchStartRef.current.zoom * scale).toFixed(2))));
        setZoom(newZoom);
        setPan(clampPan(touchStartRef.current.panX, touchStartRef.current.panY, newZoom));
      }
    } else if (e.touches.length === 1 && zoom > 1.0 && containerRef.current && touchStartRef.current.mouseX !== undefined) {
      const dx = e.touches[0].clientX - touchStartRef.current.mouseX;
      const dy = e.touches[0].clientY - touchStartRef.current.mouseY!;
      const rect = containerRef.current.getBoundingClientRect();
      const svgDx = (dx / rect.width) * MAP_WIDTH;
      const svgDy = (dy / rect.height) * MAP_HEIGHT;

      setPan(clampPan(touchStartRef.current.panX - svgDx, touchStartRef.current.panY - svgDy, zoom));
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const getState = (id: string): DistrictVisualState => {
    if (selectedDistrictId === id) return 'active';
    if (districtStates instanceof Map) {
      return districtStates.get(id) || 'default';
    }
    return districtStates[id] || 'default';
  };

  const handleHover = (id: string | null) => {
    setHoveredId(id);
    onDistrictHover?.(id);
  };

  const handleDistrictClickWrapped = (id: string) => {
    if (dragDistanceRef.current > 10) {
      // Ignore click if user was drag-panning
      return;
    }
    onDistrictClick?.(id);
  };

  const hoveredDistrict = useMemo(() => {
    if (!hoveredId) return null;
    return DISTRICT_PATHS.find((p) => p.id === hoveredId) || null;
  }, [hoveredId]);

  // Compute ViewBox string based on zoom and clamped pan coordinates
  const viewWidth = MAP_WIDTH / zoom;
  const viewHeight = MAP_HEIGHT / zoom;
  const clamped = clampPan(pan.x, pan.y, zoom);
  const viewBoxX = (MAP_WIDTH - viewWidth) / 2 + clamped.x;
  const viewBoxY = (MAP_HEIGHT - viewHeight) / 2 + clamped.y;
  const viewBoxString = `${viewBoxX} ${viewBoxY} ${viewWidth} ${viewHeight}`;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full flex items-center justify-center select-none map-touch-container ${
        isPanning ? 'cursor-grabbing' : 'cursor-default'
      } ${className}`}
    >
      <svg
        viewBox={viewBoxString}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-full max-w-full drop-shadow-2xl overflow-visible transition-all duration-75 ease-out"
        role="region"
        aria-label="Interactive Map of Bangladesh Districts"
      >
        <defs>
          <radialGradient id="water-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Map district layers */}
        <g id="bangladesh-districts">
          {DISTRICT_PATHS.map((data) => {
            const isHighlighted = highlightDivisionId
              ? data.divisionId === highlightDivisionId
              : false;

            return (
              <DistrictPath
                key={data.id}
                data={data}
                state={getState(data.id)}
                isDivisionHighlighted={isHighlighted}
                isDisabled={disabled}
                language={language}
                onClick={handleDistrictClickWrapped}
                onHover={handleHover}
              />
            );
          })}
        </g>

        {/* Optional Centroid Labels */}
        {showLabels && (
          <g id="district-labels" className="pointer-events-none">
            {DISTRICT_PATHS.map((data) => (
              <text
                key={`label-${data.id}`}
                x={data.centroid[0]}
                y={data.centroid[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-200 text-[10px] font-medium select-none pointer-events-none drop-shadow"
              >
                {language === 'bn' ? data.nameBn : data.name}
              </text>
            ))}
          </g>
        )}
      </svg>

      {/* Floating Zoom Controls Overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 4.0}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-200 transition-colors"
          title="Zoom In (Scroll up)"
          aria-label="Zoom In"
        >
          <ZoomIn size={16} />
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1.0}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-200 transition-colors"
          title="Zoom Out (Scroll down)"
          aria-label="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        <button
          onClick={handleResetZoom}
          disabled={zoom === 1.0 && pan.x === 0 && pan.y === 0}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 text-slate-200 transition-colors"
          title="Reset Zoom & Position"
          aria-label="Reset View"
        >
          <RotateCcw size={16} />
        </button>

        {zoom > 1.0 && (
          <div className="text-[10px] font-mono font-bold text-center text-emerald-400 py-0.5 border-t border-slate-800">
            {zoom.toFixed(1)}x
          </div>
        )}
      </div>

      {/* Camera Pan helper badge */}
      {zoom > 1.0 && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5 z-20 shadow-md">
          <Move size={12} className="text-teal-400 shrink-0" />
          <span>{language === 'bn' ? 'মধ্য মাউস ক্লিক দিয়ে সরান' : 'Middle-click & drag to move'}</span>
        </div>
      )}

      {/* Floating hover badge */}
      {showHoverNames && hoveredDistrict && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-600 text-sm text-slate-100 shadow-xl pointer-events-none flex items-center gap-2 z-10 transition-all duration-150">
          <span className="font-semibold text-emerald-400">
            {hoveredDistrict.name}
          </span>
          <span className="text-slate-400 font-bangla">
            ({hoveredDistrict.nameBn})
          </span>
        </div>
      )}
    </div>
  );
};
