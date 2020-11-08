layui.use(['layer', 'slider', 'jquery'], function () {
  var $ = layui.jquery
  var base = draw.base();
  var layer = layui.layer;
  var slider = layui.slider;
  var townCount = 10;

  //slider
  slider.render({
    elem: '#slider',
    max: 100,
    min: 1,
    value: 10,
    showstep: true,
    input: true,
  });
  document.addEventListener('mouseup', function () {
    setTimeout(function () {
      var count = $('input').val();
      if (townCount != count) {
        townCount = count;
        load(townCount);
      }
    });
  });

  //init
  load(10);

  function load(d) {
    d3.json('http://35.211.183.112/Circles/Towns/' + d).then(function (data) {
      base.svg.selectAll('.place').remove();
      base.svg.selectAll('.place-label').remove();
      data = json2geojson(data);

      //town label
      base.svg.selectAll(".place-label")
        .data(data.features).enter()
        .append("text")
        .attr('opacity', 0)
        .attr("class", "place-label")
        .attr("transform", function (d) {
          return "translate(" + base.projection(d.geometry.coordinates) + ")";
        })
        .attr("x", function (d) {
          return d.geometry.coordinates[0] > -1 ? 6 : -6;
        })
        .attr("dy", ".35em")
        .style("text-anchor", function (d) {
          return d.geometry.coordinates[0] > -1 ? "start" : "end";
        })
        .text(function (d) {
          return d.properties.Town;
        });

      //town point
      base.svg.selectAll(".place")
        .data(data.features).enter()
        .append('path')
        .attr("opacity", "0")
        .attr("d", base.path)
        .attr('class', 'place')
        .on('mouseover', function (d, i) {
          console.log(d.target.__data__);
          var properties = d.target.__data__.properties;
          var content = `Town: ${properties.Town}<br>
                       County: ${properties.County}<br>
                       Popolation: ${properties.Population}`;
          layer.tips(content, this, {tips: 2, time: 0});
          d3.select(this)
            .attr('stroke', '#444')
            .attr("stroke-width", 2)
            .attr('cursor', 'pointer');
        })
        .on("mouseout", function (d, i) {
          layer.closeAll('tips');
          d3.select(this)
            .attr("stroke-width", 0);
        });

      //animation
      base.svg.selectAll('.place').transition().duration(2000).attr("opacity", 1);
      base.svg.selectAll('.place-label').transition().duration(2000).attr("opacity", 1);
    });
  }
});