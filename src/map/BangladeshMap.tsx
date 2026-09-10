import React, { useMemo, useState } from 'react';
import { DISTRICT_PATHS, MAP_VIEWBOX } from './paths';
import { DistrictPath } from './DistrictPath';
import { BangladeshMapProps, DistrictVisualState } from './types';

export const BangladeshMap: React.FC<BangladeshMapProps> = ({
  districtStates = {},
  selectedDistrictId,
  highlightDivisionId,
  onDistrictClick,
  onDistrictHover,
  showLabels = false,
  language = 'en',
  disabled = false,
  className = '',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const hoveredDistrict = useMemo(() => {
    if (!hoveredId) return null;
    return DISTRICT_PATHS.find((p) => p.id === hoveredId) || null;
  }, [hoveredId]);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none map-touch-container ${className}`}
    >
      <svg
        viewBox={MAP_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[85vh] drop-shadow-2xl overflow-visible"
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
                onClick={onDistrictClick}
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

      {/* Floating hover badge */}
      {hoveredDistrict && (
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
