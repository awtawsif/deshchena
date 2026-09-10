import divisionsData from '../../data/divisions.json';
import districtsData from '../../data/districts.json';
import { Division, District } from './types';

export const divisions: Division[] = divisionsData;
export const districts: District[] = districtsData;

export const divisionMap = new Map<string, Division>(
  divisions.map((d) => [d.id, d])
);

export const districtMap = new Map<string, District>(
  districts.map((d) => [d.id, d])
);

export const getDistrictById = (id: string): District | undefined => {
  return districtMap.get(id);
};

export const getDivisionById = (id: string): Division | undefined => {
  return divisionMap.get(id);
};

export const getDistrictsByDivisionId = (divisionId: string): District[] => {
  return districts.filter((d) => d.divisionId === divisionId);
};

export * from './types';
