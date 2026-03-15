import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const pl = JSON.parse(
    fs.readFileSync(path.join(root, 'i18n/locales/pl.json'), 'utf8'),
);
const en = JSON.parse(
    fs.readFileSync(path.join(root, 'i18n/locales/en.json'), 'utf8'),
);

const plKeys = new Set(Object.keys(pl));
const enKeys = new Set(Object.keys(en));

const missingInEn = [...plKeys].filter((key) => !enKeys.has(key)).sort();
const missingInPl = [...enKeys].filter((key) => !plKeys.has(key)).sort();

const quoteChar = String.fromCharCode(39);
const keyInT = new RegExp(`\\bt\\(${quoteChar}([^${quoteChar}]+)${quoteChar}\\)`, 'g');
const keyInDollarT = new RegExp(
    `\\$t\\(${quoteChar}([^${quoteChar}]+)${quoteChar}\\)`,
    'g',
);
const usedKeys = new Set();

function walk(directoryPath) {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath);
            continue;
        }

        const extension = path.extname(entry.name);
        if (!['.vue', '.ts', '.js'].includes(extension)) continue;

        const sourceCode = fs.readFileSync(fullPath, 'utf8');

        for (const regex of [keyInT, keyInDollarT]) {
            let match = regex.exec(sourceCode);
            while (match) {
                usedKeys.add(match[1]);
                match = regex.exec(sourceCode);
            }

            regex.lastIndex = 0;
        }
    }
}

walk(path.join(root, 'app'));

const usedMissingInPl = [...usedKeys]
    .filter((key) => !plKeys.has(key))
    .sort();
const usedMissingInEn = [...usedKeys]
    .filter((key) => !enKeys.has(key))
    .sort();

console.log(`MISSING_IN_EN ${missingInEn.length}`);
for (const key of missingInEn) console.log(`  ${key}`);

console.log(`MISSING_IN_PL ${missingInPl.length}`);
for (const key of missingInPl) console.log(`  ${key}`);

console.log(`USED_KEYS ${usedKeys.size}`);
console.log(`USED_MISSING_IN_PL ${usedMissingInPl.length}`);
for (const key of usedMissingInPl) console.log(`  ${key}`);

console.log(`USED_MISSING_IN_EN ${usedMissingInEn.length}`);
for (const key of usedMissingInEn) console.log(`  ${key}`);
