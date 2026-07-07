const fs = require('fs');
const path = require('path');

const files = [
  'frontend/js/farmacologia.js',
  'frontend/js/app.js',
  'frontend/farmacologia.html',
  'frontend/dashboard.html'
];

const replacements = [
  [/\u00E2\u20AC\u201C/g, '\u2014'],  // â€" → —
  [/\u00E2\u20AC\u201D/g, '\u2014'],  // â€" → —
  [/\u00E2\u20AC\u00A6/g, '\u2026'],  // â€¦ → …
  [/\u00E2\u20AC\u201C/g, '\u2014'],  // variants
  [/\u00E2\u0080\u009C/g, '\u2014'],
  [/\u00E2\u0080\u009D/g, '\u2014'],
  [/\u00C2\u00BF/g, '\u00BF'],       // Â¿ → ¿
];

for (const file of files) {
  const fullPath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed:', file);
  } else {
    console.log('Clean:', file);
  }
}
