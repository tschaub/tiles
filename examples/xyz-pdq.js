const fs = require('fs');
const gdal = require('gdal');
const tile = require('../lib/tile');

function handleEncode(output, callback) {
  return (err, buffer) => {
    if (err) {
      callback(err);
      return;
    }
    fs.writeFile(output, buffer, callback);
  }
}

function handleRender(output, callback) {
  return (err, image) => {
    if (err) {
      callback(err);
      return;
    }
    image.encode('png:t=0', handleEncode(output, callback));
  }
}

function main(x, y, z, input, output, callback) {
  const srs = gdal.open(input).srs.toProj4();
  tile.render(x, y, z, input, srs, handleRender(output, callback));
}


if (require.main === module) {
  const x = Number(process.argv[2]);
  const y = Number(process.argv[3]);
  const z = Number(process.argv[4]);
  const input = process.argv[5];
  const output = process.argv[6];
  main(x, y, z, input, output, err => {
    if (err) {
      process.stderr.write(err.stack, () => process.exit(1));
    }
  });
}
