const fs = require('fs');

const files = [
  'src/layouts/Layout.astro',
  'src/pages/index.astro',
  'src/pages/mioty.astro',
  'public/sitemap.xml',
  'public/robots.txt',
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  const updated = content.split('/litters').join('/mioty');
  if (updated !== content) {
    fs.writeFileSync(f, updated, 'utf8');
    console.log('Updated: ' + f);
  } else {
    console.log('No change: ' + f);
  }
});

console.log('Done!');
