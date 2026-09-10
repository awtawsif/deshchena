import fs from 'fs';
import path from 'path';

interface RawDistrictMetadata {
  rawName: string;
  id: string;
  name: string;
  nameBn: string;
  divisionId: string;
  slug: string;
}

const DIVISIONS = [
  { id: 'DIV-BAR', name: 'Barishal', nameBn: 'বরিশাল', slug: 'barishal' },
  { id: 'DIV-CTG', name: 'Chattogram', nameBn: 'চট্টগ্রাম', slug: 'chattogram' },
  { id: 'DIV-DHK', name: 'Dhaka', nameBn: 'ঢাকা', slug: 'dhaka' },
  { id: 'DIV-KHL', name: 'Khulna', nameBn: 'খুলনা', slug: 'khulna' },
  { id: 'DIV-MYM', name: 'Mymensingh', nameBn: 'ময়মনসিংহ', slug: 'mymensingh' },
  { id: 'DIV-RAJ', name: 'Rajshahi', nameBn: 'রাজশাহী', slug: 'rajshahi' },
  { id: 'DIV-RNG', name: 'Rangpur', nameBn: 'রংপুর', slug: 'rangpur' },
  { id: 'DIV-SYL', name: 'Sylhet', nameBn: 'সিলেট', slug: 'sylhet' },
];

const DISTRICT_SPECS: RawDistrictMetadata[] = [
  { rawName: 'Bagerhat', id: 'BD-BAG', name: 'Bagerhat', nameBn: 'বাগেরহাট', divisionId: 'DIV-KHL', slug: 'bagerhat' },
  { rawName: 'Bandarban', id: 'BD-BAN', name: 'Bandarban', nameBn: 'বান্দরবান', divisionId: 'DIV-CTG', slug: 'bandarban' },
  { rawName: 'Barguna', id: 'BD-BRG', name: 'Barguna', nameBn: 'বরগুনা', divisionId: 'DIV-BAR', slug: 'barguna' },
  { rawName: 'Barisal', id: 'BD-BAR', name: 'Barishal', nameBn: 'বরিশাল', divisionId: 'DIV-BAR', slug: 'barishal' },
  { rawName: 'Bhola', id: 'BD-BHO', name: 'Bhola', nameBn: 'ভোলা', divisionId: 'DIV-BAR', slug: 'bhola' },
  { rawName: 'Bogura', id: 'BD-BOG', name: 'Bogura', nameBn: 'বগুড়া', divisionId: 'DIV-RAJ', slug: 'bogura' },
  { rawName: 'Brahmanbaria', id: 'BD-BRA', name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionId: 'DIV-CTG', slug: 'brahmanbaria' },
  { rawName: 'Chandpur', id: 'BD-CHA', name: 'Chandpur', nameBn: 'চাঁদপুর', divisionId: 'DIV-CTG', slug: 'chandpur' },
  { rawName: 'Chapainawabganj', id: 'BD-NAW', name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionId: 'DIV-RAJ', slug: 'chapainawabganj' },
  { rawName: 'Chattogram', id: 'BD-CTG', name: 'Chattogram', nameBn: 'চট্টগ্রাম', divisionId: 'DIV-CTG', slug: 'chattogram' },
  { rawName: 'Chuadanga', id: 'BD-CHU', name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionId: 'DIV-KHL', slug: 'chuadanga' },
  { rawName: 'Comilla', id: 'BD-CUM', name: 'Cumilla', nameBn: 'কুমিল্লা', divisionId: 'DIV-CTG', slug: 'cumilla' },
  { rawName: "Cox's Bazar", id: 'BD-COX', name: "Cox's Bazar", nameBn: 'কক্সবাজার', divisionId: 'DIV-CTG', slug: 'coxs-bazar' },
  { rawName: 'Dhaka', id: 'BD-DHK', name: 'Dhaka', nameBn: 'ঢাকা', divisionId: 'DIV-DHK', slug: 'dhaka' },
  { rawName: 'Dinajpur', id: 'BD-DIN', name: 'Dinajpur', nameBn: 'দিনাজপুর', divisionId: 'DIV-RNG', slug: 'dinajpur' },
  { rawName: 'Faridpur', id: 'BD-FAR', name: 'Faridpur', nameBn: 'ফরিদপুর', divisionId: 'DIV-DHK', slug: 'faridpur' },
  { rawName: 'Feni', id: 'BD-FEN', name: 'Feni', nameBn: 'ফেনী', divisionId: 'DIV-CTG', slug: 'feni' },
  { rawName: 'Gaibandha', id: 'BD-GAI', name: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionId: 'DIV-RNG', slug: 'gaibandha' },
  { rawName: 'Gazipur', id: 'BD-GAZ', name: 'Gazipur', nameBn: 'গাজীপুর', divisionId: 'DIV-DHK', slug: 'gazipur' },
  { rawName: 'Gopalganj', id: 'BD-GOP', name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionId: 'DIV-DHK', slug: 'gopalganj' },
  { rawName: 'Habiganj', id: 'BD-HAB', name: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionId: 'DIV-SYL', slug: 'habiganj' },
  { rawName: 'Jamalpur', id: 'BD-JAM', name: 'Jamalpur', nameBn: 'জামালপুর', divisionId: 'DIV-MYM', slug: 'jamalpur' },
  { rawName: 'Jessore', id: 'BD-JAS', name: 'Jashore', nameBn: 'যশোর', divisionId: 'DIV-KHL', slug: 'jashore' },
  { rawName: 'Jhalokati', id: 'BD-JHA', name: 'Jhalokati', nameBn: 'ঝালকাঠি', divisionId: 'DIV-BAR', slug: 'jhalokati' },
  { rawName: 'Jhenaidah', id: 'BD-JHE', name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', divisionId: 'DIV-KHL', slug: 'jhenaidah' },
  { rawName: 'Joypurhat', id: 'BD-JOY', name: 'Joypurhat', nameBn: 'জয়পুরহাট', divisionId: 'DIV-RAJ', slug: 'joypurhat' },
  { rawName: 'Khagrachhari', id: 'BD-KHA', name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', divisionId: 'DIV-CTG', slug: 'khagrachhari' },
  { rawName: 'Khulna', id: 'BD-KHL', name: 'Khulna', nameBn: 'খুলনা', divisionId: 'DIV-KHL', slug: 'khulna' },
  { rawName: 'Kishoreganj', id: 'BD-KIS', name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionId: 'DIV-DHK', slug: 'kishoreganj' },
  { rawName: 'Kurigram', id: 'BD-KUR', name: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionId: 'DIV-RNG', slug: 'kurigram' },
  { rawName: 'Kushtia', id: 'BD-KUS', name: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionId: 'DIV-KHL', slug: 'kushtia' },
  { rawName: 'Lakshmipur', id: 'BD-LAK', name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', divisionId: 'DIV-CTG', slug: 'lakshmipur' },
  { rawName: 'Lalmonirhat', id: 'BD-LAL', name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', divisionId: 'DIV-RNG', slug: 'lalmonirhat' },
  { rawName: 'Madaripur', id: 'BD-MAD', name: 'Madaripur', nameBn: 'মাদারীপুর', divisionId: 'DIV-DHK', slug: 'madaripur' },
  { rawName: 'Magura', id: 'BD-MAG', name: 'Magura', nameBn: 'মাগুরা', divisionId: 'DIV-KHL', slug: 'magura' },
  { rawName: 'Manikganj', id: 'BD-MAN', name: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionId: 'DIV-DHK', slug: 'manikganj' },
  { rawName: 'Meherpur', id: 'BD-MEH', name: 'Meherpur', nameBn: 'মেহেরপুর', divisionId: 'DIV-KHL', slug: 'meherpur' },
  { rawName: 'Moulvibazar', id: 'BD-MOU', name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionId: 'DIV-SYL', slug: 'moulvibazar' },
  { rawName: 'Munshiganj', id: 'BD-MUN', name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionId: 'DIV-DHK', slug: 'munshiganj' },
  { rawName: 'Mymensingh', id: 'BD-MYM', name: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionId: 'DIV-MYM', slug: 'mymensingh' },
  { rawName: 'Naogaon', id: 'BD-NAO', name: 'Naogaon', nameBn: 'নওগাঁ', divisionId: 'DIV-RAJ', slug: 'naogaon' },
  { rawName: 'Narail', id: 'BD-NAR', name: 'Narail', nameBn: 'নড়াইল', divisionId: 'DIV-KHL', slug: 'narail' },
  { rawName: 'Narayanganj', id: 'BD-NRY', name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionId: 'DIV-DHK', slug: 'narayanganj' },
  { rawName: 'Narsingdi', id: 'BD-NRS', name: 'Narsingdi', nameBn: 'নরসিংদী', divisionId: 'DIV-DHK', slug: 'narsingdi' },
  { rawName: 'Natore', id: 'BD-NAT', name: 'Natore', nameBn: 'নাটোর', divisionId: 'DIV-RAJ', slug: 'natore' },
  { rawName: 'Netrokona', id: 'BD-NET', name: 'Netrokona', nameBn: 'নেত্রকোণা', divisionId: 'DIV-MYM', slug: 'netrokona' },
  { rawName: 'Nilphamari', id: 'BD-NIL', name: 'Nilphamari', nameBn: 'নীলফামারী', divisionId: 'DIV-RNG', slug: 'nilphamari' },
  { rawName: 'Noakhali', id: 'BD-NOA', name: 'Noakhali', nameBn: 'নোয়াখালী', divisionId: 'DIV-CTG', slug: 'noakhali' },
  { rawName: 'Pabna', id: 'BD-PAB', name: 'Pabna', nameBn: 'পাবনা', divisionId: 'DIV-RAJ', slug: 'pabna' },
  { rawName: 'Panchagarh', id: 'BD-PAN', name: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionId: 'DIV-RNG', slug: 'panchagarh' },
  { rawName: 'Patuakhali', id: 'BD-PAT', name: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionId: 'DIV-BAR', slug: 'patuakhali' },
  { rawName: 'Pirojpur', id: 'BD-PIR', name: 'Pirojpur', nameBn: 'পিরোজপুর', divisionId: 'DIV-BAR', slug: 'pirojpur' },
  { rawName: 'Rajbari', id: 'BD-RJB', name: 'Rajbari', nameBn: 'রাজবাড়ী', divisionId: 'DIV-DHK', slug: 'rajbari' },
  { rawName: 'Rajshahi', id: 'BD-RAJ', name: 'Rajshahi', nameBn: 'রাজশাহী', divisionId: 'DIV-RAJ', slug: 'rajshahi' },
  { rawName: 'Rangamati', id: 'BD-RAN', name: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionId: 'DIV-CTG', slug: 'rangamati' },
  { rawName: 'Rangpur', id: 'BD-RNG', name: 'Rangpur', nameBn: 'রংপুর', divisionId: 'DIV-RNG', slug: 'rangpur' },
  { rawName: 'Satkhira', id: 'BD-SAT', name: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionId: 'DIV-KHL', slug: 'satkhira' },
  { rawName: 'Shariatpur', id: 'BD-SHA', name: 'Shariatpur', nameBn: 'শরীয়তপুর', divisionId: 'DIV-DHK', slug: 'shariatpur' },
  { rawName: 'Sherpur', id: 'BD-SHE', name: 'Sherpur', nameBn: 'শেরপুর', divisionId: 'DIV-MYM', slug: 'sherpur' },
  { rawName: 'Sirajganj', id: 'BD-SIR', name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionId: 'DIV-RAJ', slug: 'sirajganj' },
  { rawName: 'Sunamganj', id: 'BD-SUN', name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionId: 'DIV-SYL', slug: 'sunamganj' },
  { rawName: 'Sylhet', id: 'BD-SYL', name: 'Sylhet', nameBn: 'সিলেট', divisionId: 'DIV-SYL', slug: 'sylhet' },
  { rawName: 'Tangail', id: 'BD-TAN', name: 'Tangail', nameBn: 'টাঙ্গাইল', divisionId: 'DIV-DHK', slug: 'tangail' },
  { rawName: 'Thakurgaon', id: 'BD-THA', name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', divisionId: 'DIV-RNG', slug: 'thakurgaon' },
];

function roundCoord(c: any): any {
  if (typeof c === 'number') {
    return Math.round(c * 100000) / 100000;
  }
  return c.map(roundCoord);
}

function run() {
  const sourceArg = process.argv[2];
  if (!sourceArg) {
    throw new Error('Usage: tsx scripts/prepare-data.ts <path-to-raw-geojson>');
  }
  const sourcePath = path.resolve(sourceArg);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at ${sourcePath}`);
  }

  const rawGeo = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  console.log(`Source features: ${rawGeo.features.length}`);

  const specMap = new Map<string, RawDistrictMetadata>();
  for (const s of DISTRICT_SPECS) {
    specMap.set(s.rawName, s);
  }

  const features = [];
  const districts = [];

  for (const feat of rawGeo.features) {
    const rawName = feat.properties.ADM2_EN;
    const spec = specMap.get(rawName);
    if (!spec) {
      throw new Error(`Unrecognized district rawName: ${rawName}`);
    }

    // Canonical district record
    districts.push({
      id: spec.id,
      name: spec.name,
      nameBn: spec.nameBn,
      divisionId: spec.divisionId,
      slug: spec.slug,
    });

    // GeoJSON feature with normalized properties
    features.push({
      type: 'Feature',
      id: spec.id,
      properties: {
        id: spec.id,
        name: spec.name,
        nameBn: spec.nameBn,
        divisionId: spec.divisionId,
        slug: spec.slug,
      },
      geometry: {
        type: feat.geometry.type,
        coordinates: roundCoord(feat.geometry.coordinates),
      },
    });
  }

  // Sort districts by English name for cleanliness
  districts.sort((a, b) => a.name.localeCompare(b.name));
  features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));

  const geoJson = {
    type: 'FeatureCollection',
    name: 'bangladesh-districts',
    features,
  };

  // Write divisions.json
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data/divisions.json'),
    JSON.stringify(DIVISIONS, null, 2) + '\n'
  );

  // Write districts.json
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data/districts.json'),
    JSON.stringify(districts, null, 2) + '\n'
  );

  // Write GeoJSON
  fs.writeFileSync(
    path.resolve(process.cwd(), 'data/geo/bangladesh-districts.geojson'),
    JSON.stringify(geoJson) + '\n'
  );

  console.log(`Successfully generated:`);
  console.log(`- data/divisions.json (${DIVISIONS.length} divisions)`);
  console.log(`- data/districts.json (${districts.length} districts)`);
  console.log(`- data/geo/bangladesh-districts.geojson (${features.length} features)`);
}

run();
