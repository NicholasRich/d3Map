var draw = {
  base: function () {
    // init
    var width = 960;
    var height = 1160;
    var projection = d3.geoAlbers()
      .center([0, 55.4])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(6000)
      .translate([width / 2, height / 2]);
    var path = d3.geoPath(projection).pointRadius(4);
    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style('margin', '0 auto');

    //color
    svg.selectAll(".subunit")
      .data(topojson.feature(ukJson, ukJson.objects.subunits).features)
      .enter().append("path")
      .attr("class", function (d) {
        return "subunit " + d.id;
      })
      .attr("d", path);

    //boundary
    svg.append("path")
      .datum(topojson.mesh(ukJson, ukJson.objects.subunits, function (a, b) {
        return a !== b && a.id !== "IRL";
      }))
      .attr("d", path)
      .attr("class", "subunit-boundary");
    svg.append("path")
      .datum(topojson.mesh(ukJson, ukJson.objects.subunits, function (a, b) {
        return a === b && a.id === "IRL";
      }))
      .attr("d", path)
      .attr("class", "subunit-boundary IRL");

    //country label
    svg.selectAll(".subunit-label")
      .data(topojson.feature(ukJson, ukJson.objects.subunits).features)
      .enter().append("text")
      .attr("class", function (d) {
        return "subunit-label " + d.id;
      })
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .text(function (d) {
        return d.properties.name;
      });
    return {projection: projection, svg: svg, path: path};
  }
};