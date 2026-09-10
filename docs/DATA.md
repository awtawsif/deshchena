# Bangladesh 64 (Deshchena) — Data Specifications & Provenance

## 1. Zero Hallucination Geographic Invariant
- Boundaries and coordinates must NEVER be synthesized or hallucinated by an LLM.
- All boundaries must originate from authoritative geographic data sets (e.g. Humanitarian Data Exchange HDX / Bangladesh Bureau of Statistics / GADM / OpenStreetMap).
- Provenance, licensing, and attribution must be recorded in `data/geo/source.md`.

---

## 2. Canonical Data Models

### 2.1 Division (`data/divisions.json`)
```typescript
interface Division {
  id: string;        // Stable ID, e.g. "DIV-DHK", "DIV-CTG"
  name: string;      // English display name, e.g. "Dhaka"
  nameBn: string;    // Bangla display name, e.g. "ঢাকা"
  slug: string;      // "dhaka"
}
```

Exactly 8 divisions:
1. Barishal (বরিশাল)
2. Chattogram (চট্টগ্রাম)
3. Dhaka (ঢাকা)
4. Khulna (খুলনা)
5. Mymensingh (ময়মনসিংহ)
6. Rajshahi (রাজশাহী)
7. Rangpur (রংপুর)
8. Sylhet (সিলেট)

### 2.2 District (`data/districts.json`)
```typescript
interface District {
  id: string;        // Stable ID, e.g. "BD-DHK", "BD-GAZ"
  name: string;      // English display name, e.g. "Gazipur"
  nameBn: string;    // Bangla display name, e.g. "গাজীপুর"
  divisionId: string;// e.g. "DIV-DHK"
  slug: string;      // "gazipur"
}
```

Exactly 64 districts.

---

## 3. GeoJSON Format (`data/geo/bangladesh-districts.geojson`)
- FeatureCollection where every Feature corresponds to one of the 64 districts.
- Each Feature properties object MUST have:
  ```json
  {
    "id": "BD-GAZ",
    "name": "Gazipur",
    "nameBn": "গাজীপুর",
    "divisionId": "DIV-DHK",
    "slug": "gazipur"
  }
  ```
- Geometry: `Polygon` or `MultiPolygon`.

---

## 4. Automated Data Validation (`npm run validate:data`)
The CI / local script validates:
- [x] Exactly 8 divisions
- [x] Exactly 64 districts
- [x] Every district references a valid division ID
- [x] Every district has a non-empty English name and Bangla name
- [x] Every district ID is unique
- [x] Every district has a corresponding GeoJSON feature with matching `id`
- [x] No orphan GeoJSON features
- [x] All GeoJSON geometries are valid polygons/multipolygons
