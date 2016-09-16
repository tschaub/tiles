const mapnik = require('mapnik');
const xyz = require('./xyz');

mapnik.register_default_input_plugins();

const style = `
  <Map>
    <Style name="raster" image-filters="agg-stack-blur(1,1) sharpen()">
      <Rule><RasterSymbolizer scaling="bilinear"/></Rule>
    </Style>
  </Map>
`;

const styleNames = ['raster'];
const tileSize = xyz.tileSize;
const mapSrs = '+init=epsg:3857';

exports.render = function(x, y, z, file, srs, callback) {

  const map = new mapnik.Map(tileSize, tileSize, mapSrs);
  map.fromString(style, err => {
    if (err) {
      callback(err);
      return;
    }

    const layer = new mapnik.Layer('base', srs);
    layer.datasource = new mapnik.Datasource({
      type: 'gdal',
      file: file
    });
    layer.styles = styleNames;
    map.add_layer(layer);

    map.extent = xyz.getTileExtent(x, y, z);

    const image = new mapnik.Image(tileSize, tileSize);
    map.render(image, callback);
  });

};
