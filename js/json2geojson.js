var json2geojson = function (data) {
  var features = [];
  data.forEach(function (object) {
    var feature = {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [object.lng, object.lat]},
      properties: object
    }
    features.push(feature);
  });
  var geojson={type: "FeatureCollection", features: features};
  console.log(geojson);
  return geojson;
};