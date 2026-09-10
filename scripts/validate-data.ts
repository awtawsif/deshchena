import fs from 'fs';
import path from 'path';

interface Division {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
}

interface District {
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  slug: string;
}

interface GeoJsonFeature {
  type: string;
  id?: string;
  properties: {
    id: string;
    name: string;
    nameBn?: string;
    divisionId: string;
    slug?: string;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

interface GeoJsonCollection {
  type: string;
  features: GeoJsonFeature[];
}

function validate() {
  console.log('🔍 Validating Bangladesh Geography Data...\n');
  const errors: string[] = [];

  const divisionsPath = path.resolve(process.cwd(), 'data/divisions.json');
  const districtsPath = path.resolve(process.cwd(), 'data/districts.json');
  const geojsonPath = path.resolve(process.cwd(), 'data/geo/bangladesh-districts.geojson');

  if (!fs.existsSync(divisionsPath)) {
    throw new Error(`Missing ${divisionsPath}`);
  }
  if (!fs.existsSync(districtsPath)) {
    throw new Error(`Missing ${districtsPath}`);
  }
  if (!fs.existsSync(geojsonPath)) {
    throw new Error(`Missing ${geojsonPath}`);
  }

  const divisions: Division[] = JSON.parse(fs.readFileSync(divisionsPath, 'utf8'));
  const districts: District[] = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
  const geojson: GeoJsonCollection = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

  // 1. Validate Divisions
  if (divisions.length !== 8) {
    errors.push(`Expected exactly 8 divisions, found ${divisions.length}`);
  }

  const divisionIds = new Set<string>();
  for (const div of divisions) {
    if (!div.id || !div.id.startsWith('DIV-')) {
      errors.push(`Invalid division ID: "${div.id}". Must start with "DIV-"`);
    }
    if (divisionIds.has(div.id)) {
      errors.push(`Duplicate division ID: "${div.id}"`);
    }
    divisionIds.add(div.id);

    if (!div.name || div.name.trim().length === 0) {
      errors.push(`Division ${div.id} is missing English name`);
    }
    if (!div.nameBn || div.nameBn.trim().length === 0) {
      errors.push(`Division ${div.id} is missing Bangla name`);
    }
    if (!div.slug || div.slug.trim().length === 0) {
      errors.push(`Division ${div.id} is missing slug`);
    }
  }

  // 2. Validate Districts
  if (districts.length !== 64) {
    errors.push(`Expected exactly 64 districts, found ${districts.length}`);
  }

  const districtIds = new Set<string>();
  const districtNames = new Set<string>();
  const districtSlugs = new Set<string>();

  for (const dist of districts) {
    if (!dist.id || !dist.id.startsWith('BD-')) {
      errors.push(`Invalid district ID: "${dist.id}". Must start with "BD-"`);
    }
    if (districtIds.has(dist.id)) {
      errors.push(`Duplicate district ID: "${dist.id}"`);
    }
    districtIds.add(dist.id);

    if (districtNames.has(dist.name)) {
      errors.push(`Duplicate district name: "${dist.name}"`);
    }
    districtNames.add(dist.name);

    if (districtSlugs.has(dist.slug)) {
      errors.push(`Duplicate district slug: "${dist.slug}"`);
    }
    districtSlugs.add(dist.slug);

    if (!dist.name || dist.name.trim().length === 0) {
      errors.push(`District ${dist.id} is missing English name`);
    }
    if (!dist.nameBn || dist.nameBn.trim().length === 0) {
      errors.push(`District ${dist.id} is missing Bangla name`);
    }
    if (!dist.divisionId || !divisionIds.has(dist.divisionId)) {
      errors.push(`District ${dist.id} (${dist.name}) references invalid divisionId: "${dist.divisionId}"`);
    }
  }

  // 3. Validate GeoJSON
  if (geojson.type !== 'FeatureCollection') {
    errors.push(`GeoJSON root type must be "FeatureCollection", got "${geojson.type}"`);
  }
  if (!Array.isArray(geojson.features)) {
    errors.push('GeoJSON features must be an array');
  } else {
    if (geojson.features.length !== 64) {
      errors.push(`Expected 64 GeoJSON features, got ${geojson.features.length}`);
    }

    const featureIds = new Set<string>();
    for (const feat of geojson.features) {
      const featId = feat.id || feat.properties?.id;
      if (!featId) {
        errors.push(`GeoJSON feature has no ID: ${JSON.stringify(feat.properties)}`);
        continue;
      }
      if (featureIds.has(featId)) {
        errors.push(`Duplicate GeoJSON feature ID: "${featId}"`);
      }
      featureIds.add(featId);

      if (!districtIds.has(featId)) {
        errors.push(`Orphan GeoJSON feature with ID "${featId}" not in canonical districts`);
      }

      if (!feat.geometry || !['Polygon', 'MultiPolygon'].includes(feat.geometry.type)) {
        errors.push(`Feature ${featId} has invalid geometry type: ${feat.geometry?.type}`);
      }

      if (!feat.geometry?.coordinates || feat.geometry.coordinates.length === 0) {
        errors.push(`Feature ${featId} has empty coordinates`);
      }
    }

    // Check for districts without a feature
    for (const distId of districtIds) {
      if (!featureIds.has(distId)) {
        errors.push(`District ${distId} has no corresponding GeoJSON feature`);
      }
    }
  }

  // Reporting
  if (errors.length > 0) {
    console.error('❌ Data Validation Failed:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  } else {
    console.log('✅ Validation Passed!');
    console.log(`  ✓ Exactly 8 divisions verified`);
    console.log(`  ✓ Exactly 64 districts verified`);
    console.log(`  ✓ All district IDs unique and valid`);
    console.log(`  ✓ All division relationships verified`);
    console.log(`  ✓ All English and Bangla names present`);
    console.log(`  ✓ All 64 GeoJSON features matched with zero orphans`);
    console.log(`  ✓ Valid MultiPolygon/Polygon geometries\n`);
  }
}

validate();
