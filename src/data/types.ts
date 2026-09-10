export interface Division {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
}

export interface District {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  slug: string;
}

export interface DistrictFeatureProperties {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  slug: string;
}

export interface BangladeshGeoJSON {
  type: 'FeatureCollection';
  name: string;
  features: Array<{
    type: 'Feature';
    id: string;
    properties: DistrictFeatureProperties;
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: any;
    };
  }>;
}
