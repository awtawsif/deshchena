import { describe, it, expect } from 'vitest';
import {
  divisions,
  districts,
  getDistrictById,
  getDivisionById,
  getDistrictsByDivisionId,
} from './index';

describe('Data Module', () => {
  it('loads exactly 8 divisions and 64 districts', () => {
    expect(divisions).toHaveLength(8);
    expect(districts).toHaveLength(64);
  });

  it('retrieves district by stable ID', () => {
    const gazipur = getDistrictById('BD-GAZ');
    expect(gazipur).toBeDefined();
    expect(gazipur?.name).toBe('Gazipur');
    expect(gazipur?.nameBn).toBe('গাজীপুর');
    expect(gazipur?.divisionId).toBe('DIV-DHK');
  });

  it('retrieves division by stable ID', () => {
    const dhaka = getDivisionById('DIV-DHK');
    expect(dhaka).toBeDefined();
    expect(dhaka?.name).toBe('Dhaka');
    expect(dhaka?.nameBn).toBe('ঢাকা');
  });

  it('retrieves districts by division', () => {
    const sylhetDistricts = getDistrictsByDivisionId('DIV-SYL');
    expect(sylhetDistricts).toHaveLength(4);
    const names = sylhetDistricts.map((d) => d.name).sort();
    expect(names).toEqual(['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet']);
  });
});
