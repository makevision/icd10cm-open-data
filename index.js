// Convenience loader for Node consumers. Every dataset is also a plain CSV/JSON file under icd10cm/.
'use strict';
const path = require('path');
const fs = require('fs');
const root = __dirname;
function load(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
module.exports = {
  manifest: () => load('manifest.json'),
  codeCounts: () => load('icd10cm/code-counts/icd10cm-code-counts-fy2016-fy2027.json').rows,
  fy2027: {
    summary: () => load('icd10cm/fy2027-changes/summary.json'),
    added: () => load('icd10cm/fy2027-changes/added.json'),
    deleted: () => load('icd10cm/fy2027-changes/deleted.json'),
    revised: () => load('icd10cm/fy2027-changes/revised.json'),
    billableStatusChanges: () => load('icd10cm/fy2027-changes/billable-status-changes.json'),
  },
  excludes: {
    excludes1: () => load('icd10cm/excludes-notes/fy2027-excludes1.json'),
    excludes2: () => load('icd10cm/excludes-notes/fy2027-excludes2.json'),
    byChapter: (fy = 2027) => load(`icd10cm/excludes-notes/fy${fy}-excludes-by-chapter.json`).rows,
  },
};
