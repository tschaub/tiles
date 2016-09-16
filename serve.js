const gdal = require('gdal');
const http = require('http');
const path = require('path');
const tile = require('./lib/tile');
const url = require('url');

const PORT = Number(process.env.PORT) || 3000;

const srsLookup = {};

const dataDir = './data';

function notFound(response) {
  response.writeHead(400);
  response.end('Not found');
}

function serverError(message, err, response) {
  process.stderr.write(`${message}\n`);
  process.stderr.write(err.stack);
  response.writeHead(500);
  response.end('Server error');
}

function serveTile(id, x, y, z, response) {
  let srs = srsLookup[id];
  const file = path.join(dataDir, `${id}.tif`);
  if (!srs) {
    try {
      srs = gdal.open(file).srs.toProj4();
    } catch (err) {
      return notFound(response);
    }
    srsLookup[id] = srs;
  }
  tile.render(x, y, z, file, srs, (err, image) => {
    if (err) {
      return serverError(`Failed to render $file [${x}, ${y}, ${z}]`, err, response);
    }

    image.encode('png', (err, buffer) => {
      if (err) {
        return serverError(`Failed to encode PNG for $file [${x}, ${y}, ${z}]`, err, response);
      }
      response.writeHead(200, {
        'content-type': 'image/png',
        'content-length': buffer.length
      });
      response.end(buffer);
    });

  });
}

const server = http.createServer((request, response) => {
  const [_, id, z, x, y] = url.parse(request.url).pathname.split('/');
  if (!id || !z || !x || !y) {
    return notFound(response);
  }
  serveTile(id, x, y, z, response);
});

server.listen(PORT, _ => {
  process.stdout.write(`Server listening on: http://localhost:${PORT}\n`);
});
