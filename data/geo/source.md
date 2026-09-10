# Geographic Data Provenance

## Source Overview
- **Dataset:** Bangladesh Administrative Boundaries (Level 2: 64 Districts / Zillas)
- **Primary Source Authority:** Bangladesh Bureau of Statistics (BBS) via United Nations Office for the Coordination of Humanitarian Affairs (UN OCHA) / Humanitarian Data Exchange (HDX)
- **Source URL:** [Humanitarian Data Exchange - Bangladesh Administrative Boundaries](https://data.humdata.org/dataset/administrative-boundaries-of-bangladesh-as-of-2015)
- **Secondary Reference & Verification:** [geoBoundaries gbOpen Bangladesh ADM3](https://www.geoboundaries.org/) and Bangladesh National Portal
- **Validation Date:** September 2026 (Reflecting 2018 official English spelling updates: Barishal, Bogura, Chattogram, Cumilla, Jashore)

## Licensing & Attribution
- **GeoJSON Boundaries:** Creative Commons Attribution for Intergovernmental Organisations (CC BY-IGO 3.0) / CC BY 4.0.
  - Attribution: *Boundary data © Bangladesh Bureau of Statistics (BBS) / UN OCHA / geoBoundaries contributors.*
- **Administrative Metadata:** MIT License (Community-verified naming and administrative hierarchy).

## Processing Methodology
1. Validated that all 64 districts and 8 divisions match the official administrative census breakdown of Bangladesh.
2. Normalized district IDs into stable, mnemonic, non-display identifiers (e.g. `BD-DHK`, `BD-GAZ`, `BD-CTG`).
3. Decoupled rich canonical metadata (`data/districts.json` and `data/divisions.json`) containing English, Bangla (বাংলা), division IDs, and URL slugs from raw geographic geometry.
4. Cleaned and normalized GeoJSON feature properties to maintain clean foreign key relationships: `id`, `name`, `nameBn`, `divisionId`, and `slug`.
5. Rounded coordinates to 5 decimal places (~1.1 meter physical resolution) to eliminate precision bloat without altering visual boundary accuracy.
