const RADIUS = 6378137; // equatorial radius (in meters) of the earth using the WGS-84 spherioid
const HALF_CIRCUMFERENCE = Math.PI * RADIUS; // at the equator, if it were a sphere

const TILE_SIZE = 256; // pixels
const MAX_RESOLUTION = 2 * HALF_CIRCUMFERENCE / TILE_SIZE; // fitting the earth into a single tile

const ZOOM_FACTOR = 2; // halve the resolution at each successive zoom level

const MAX_ZOOM = 20; // optimization, levels above this will encur and extra Math.pow() penalty
const RESOLUTIONS = new Array(MAX_ZOOM + 1);

function getResolution(z) {
  return MAX_RESOLUTION / Math.pow(ZOOM_FACTOR, z);
}

for (let z = 0; z <= MAX_ZOOM; ++z) {
  RESOLUTIONS[z] = getResolution(z);
}

exports.getTileExtent = function(x, y, z) {
  let resolution;
  if (z <= MAX_ZOOM) {
    resolution = RESOLUTIONS[z];
  } else {
    resolution = getResolution(z);
  }
  const size = resolution * TILE_SIZE;
  const minX = x * size - HALF_CIRCUMFERENCE;
  const maxY = HALF_CIRCUMFERENCE - y * size;
  return [minX, maxY - size, minX + size, maxY];
};

exports.tileSize = TILE_SIZE;
