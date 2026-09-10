import React, { memo } from 'react';
import { DistrictPathData, DistrictVisualState } from './types';
import { getDistrictSvgClasses } from './styles';

interface DistrictPathProps {
  data: DistrictPathData;
  state?: DistrictVisualState;
  isDivisionHighlighted?: boolean;
  isDisabled?: boolean;
  language?: 'en' | 'bn';
  onClick?: (id: string) => void;
  onHover?: (id: string | null) => void;
}

export const DistrictPath: React.FC<DistrictPathProps> = memo(
  ({
    data,
    state = 'default',
    isDivisionHighlighted = false,
    isDisabled = false,
    language = 'en',
    onClick,
    onHover,
  }) => {
    const displayName = language === 'bn' ? data.nameBn : data.name;
    const classes = getDistrictSvgClasses(state, isDivisionHighlighted, isDisabled);

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick(data.id);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<SVGPathElement>) => {
      if (isDisabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(data.id);
      }
    };

    return (
      <path
        id={`district-${data.id}`}
        d={data.d}
        className={`transition-all duration-150 outline-none focus:stroke-yellow-300 focus:stroke-2 ${classes}`}
        strokeWidth={state === 'correct' || state === 'incorrect' || state === 'hint' ? 2 : 1}
        strokeLinejoin="round"
        strokeLinecap="round"
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={`${displayName} district`}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => onHover?.(data.id)}
        onMouseLeave={() => onHover?.(null)}
      />
    );
  }
);

DistrictPath.displayName = 'DistrictPath';
