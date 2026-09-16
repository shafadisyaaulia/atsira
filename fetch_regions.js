const fs = require('fs');
const https = require('https');

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
  }).on('error', reject);
});

async function main() {
  console.log("Fetching provinces...");
  const provinces = await fetchJson('https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json');
  
  const regionsData = {};
  
  for (const prov of provinces) {
    console.log("Fetching regencies for", prov.name);
    const regencies = await fetchJson(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${prov.id}.json`);
    
    // Title case formatter
    const toTitleCase = (str) => str.replace(/^(KABUPATEN|KOTA|PROVINSI)\s+/i, "").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    
    regionsData[toTitleCase(prov.name)] = regencies.map(r => toTitleCase(r.name));
  }
  
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync('public/regions.json', JSON.stringify(regionsData));
  console.log("Done! Saved to public/regions.json");
}

main();
