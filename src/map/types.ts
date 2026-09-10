export type DistrictVisualState =
  | 'default'
  | 'hover'
  | 'active'
  | 'correct'
  | 'incorrect'
  | 'hint'
  | 'disabled';

export interface DistrictPathData {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  slug: string;
  d: string;
  centroid: [number, number];
}

export interface BangladeshMapProps {
  districtStates?: Record<string, DistrictVisualState> | Map<string, DistrictVisualState>;
  selectedDistrictId?: string | null;
  highlightDivisionId?: string | null;
  onDistrictClick?: (districtId: string) => void;
  onDistrictHover?: (districtId: string | null) => void;
  showLabels?: boolean;
  language?: 'en' | 'bn';
  disabled?: boolean;
  className?: string;
}
