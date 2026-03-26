const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'public', 'piggy-bank-logo.png');
const output = path.join(__dirname, 'public', 'piggy-bank-logo.webp');

sharp(input)
  .resize(200, 200)
  .webp({ quality: 80 })
  .toFile(output)
  .then(info => console.log('Successfully converted:', info))
  .catch(err => console.error('Error converting:', err));
