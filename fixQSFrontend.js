const fs = require('fs');
let content = fs.readFileSync('app/dashboard/seller/qualitysense/page.tsx', 'utf8');

// Update startAiScan to send all data
content = content.replace(
  `JSON.stringify({ paActual: pa })`,
  `JSON.stringify({ 
          paActual: pa,
          visualStyle: formData.visualStyle,
          storageDuration: formData.storageDuration,
          containerType: formData.containerType
        })`
);

fs.writeFileSync('app/dashboard/seller/qualitysense/page.tsx', content, 'utf8');
