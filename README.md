# ICD-10-CM open data

Machine-readable derivatives of the public-domain ICD-10-CM files that CMS and the CDC's National
Center for Health Statistics publish each fiscal year. Every row is produced mechanically from an
official file by a script that is re-run for each release; nothing here is editorial.

Published by [MedCoder.ai](https://medcoder.ai), an independent medical coding reference. Not
affiliated with CMS, CDC, AMA, WHO, or NLM. License: CC0 1.0 (see `LICENSE`).

If you use these files, a link to https://medcoder.ai and to this repository is appreciated but
not required.

## What is here

| Dataset | Files | Rows | What it answers |
|---|---|---|---|
| Code counts by fiscal year | `icd10cm/code-counts/icd10cm-code-counts-fy2016-fy2027.{csv,json}` | 12 | How many ICD-10-CM codes exist each year, how many are valid for reporting, how many were added and removed |
| FY2027 change lists | `icd10cm/fy2027-changes/{added,deleted,revised,billable-status-changes}.{csv,json}`, `summary.json` | 238 / 21 / 4 / 15 | Exactly which codes changed between the FY2026 and FY2027 order files |
| Excludes1 notes | `icd10cm/excludes-notes/fy2027-excludes1.{csv,json}` | 5,411 | Every Excludes1 note line in the FY2027 tabular, with the codes it references parsed out |
| Excludes2 notes | `icd10cm/excludes-notes/fy2027-excludes2.{csv,json}` | 2,529 | Same for Excludes2 |
| Excludes census by chapter | `icd10cm/excludes-notes/fy{2026,2027}-excludes-by-chapter.{csv,json}` | 22 per year | Note counts, locations, and cross-chapter references per chapter |

`manifest.json` lists every file with its row count and the generation date.

## Definitions

**Order-file entry.** One line in the CMS `icd10cm_order_YYYY.txt` file. The file lists every
category, subcategory, and code in tabular order. Entries with the billable flag set to `1` are
valid codes that can be reported on a claim; entries with `0` are headers that need further
characters. "How many ICD-10-CM codes are there" has two honest answers, and the counts file
gives both: `totalEntries` and `billableCodes`.

**Added / deleted vs prior year.** An entry present in one year's order file and absent from
the other, headers included. **billableAdded / billableRemoved** is the view CMS uses in its own
release announcements: a code counts as new when it is valid this year and was absent or a
header last year, and as removed when it was valid last year and is absent or has become a
header this year (a code that gains children stops being reportable even though the entry
survives). The FY2027 figures on this basis are 190 new and 30 removed.

**Revised.** Same code, different long or short title.

**Excludes note line.** One `<note>` element inside an `<excludes1>` or `<excludes2>` block in the
CMS tabular XML. A block at one code can hold several lines; `locationsWithExcludes1` counts
blocks, `excludes1Notes` counts lines. Chapter- and block-level notes are included and labelled
`Chapter N` / `Block X00-X99` in the `code` column.

**referencedCodes.** The code-shaped tokens inside the note's parentheses, kept exactly as
printed (`A05.-`, `A04.0-A04.4`, `J09.X3`). Lines whose reference is prose ("code to pain by
site, such as:") or uses a construction the parser does not recognise ("E08-E13 with .42") have
an empty `referencedCodes` field; 83 of 5,411 Excludes1 lines are in that state.
`referencedCategories` is the set of 3-character categories those references fall in.

## Caveats

- The FY2024 order file archived here includes the April 1, 2024 mid-year additions (the W44
  category is present), so its `billableAdded` figure (437) is higher than the October 2023
  release announcement. Every other year's file is the October release.
- Chapter membership of a referenced code is decided by its category against the chapter's
  printed range. Chapter 22 (U codes) sits outside the alphabetical sequence and is handled by
  its own range.
- These are reference data, not coding advice. Verify against the current official CMS/CDC
  files before use on a claim.

## Sources

- FY2027 code descriptions and tabular: https://www.cms.gov/files/zip/2027-code-descriptions-tabular-order.zip
- FY2026: https://www.cms.gov/files/zip/2026-code-descriptions-tabular-order.zip
- FY2016 to FY2025 order files: the CDC/NCHS FTP archive, URL per row in the counts file.

## Reproducing

The generator lives in the MedCoder.ai codebase as `scripts/build-open-data.ts`. It reads the
official files from an `official-data/` directory and writes this tree. Node consumers can also
`require('icd10cm-open-data')` for a small loader over the JSON files (see `index.js`).

## Browsing the same data

- FY2027 change log with successor determinations: https://medcoder.ai/updates/icd10cm/icd10cm-fy2027
- Any code's Excludes notes: https://medcoder.ai/icd10/code/<code>
- Compare two codes: https://medcoder.ai/compare
- Check a code list for Excludes1 conflicts: https://medcoder.ai/claim-check
