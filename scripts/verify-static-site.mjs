import { readFile, access } from 'node:fs/promises';

const files = [
  'index.html',
  'policy.html',
  'acceptance.html',
  'consent.html',
  'assets/styles.css',
  'assets/main.js',
  'assets/brand/logo.svg',
  'assets/brand/logo_full.svg'
];
await Promise.all(files.map((file) => access(file)));

const index = await readFile('index.html', 'utf8');
const css = await readFile('assets/styles.css', 'utf8');
const js = await readFile('assets/main.js', 'utf8');
const policy = await readFile('policy.html', 'utf8');
const acceptance = await readFile('acceptance.html', 'utf8');

const requiredIndexSnippets = [
  'Разрабатываем цифровые сервисы и платформы для телекома и госсектора',
  'id="projects"',
  'id="services"',
  'id="solutions"',
  'id="contacts"',
  'data-theme-toggle',
  'data-phone',
  'acceptance.html',
  'policy.html',
  'assets/brand/logo_full.svg'
];
for (const snippet of requiredIndexSnippets) {
  if (!index.includes(snippet)) throw new Error(`index.html missing ${snippet}`);
}
if (!css.includes('@media (max-width:767px)')) throw new Error('mobile media query missing');
if (!css.includes('[data-theme="dark"]')) throw new Error('dark theme styles missing');
if (!js.includes('prefers-color-scheme')) throw new Error('theme autodetect missing');
if (!js.includes('data-phone')) throw new Error('phone mask script missing');
if (!policy.includes('Состав обрабатываемых данных') || !policy.includes('<table>')) throw new Error('policy table missing');
if (!acceptance.includes('Согласие на обработку персональных данных')) throw new Error('acceptance page title is missing');

console.log(`Static site verification passed: ${files.length} files checked.`);
