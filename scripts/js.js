var app = {

};

app.init = function() {
    $('svg').css('border', '2px solid red');
};


var dataset = [{
    label: 'Abulia',
    count: 10
}, {
    label: 'Betelgeuse',
    count: 20
}, {
    label: 'Cantaloupe',
    count: 30
}, {
    label: 'Dijkstra',
    count: 40
}];


var width = 200,
    height = 200,
    radius = Math.min(width, height) / 2,
    donutWidth = 75,
    legendRectSize = 18,
    legendSpacing = 4;

var color = d3.scale.ordinal()
    .range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);


var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');



var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

var pie = d3.layout.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);

d3.csv('weekdays.csv', function(error, dataset) { 
  dataset.forEach(function(d) {                   
    d.count = +d.count;                           
  });

var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
        return color(d.data.label);
    });

// When iterating over a dataset, D3 provides the index of the current entry as the second parameter to the callback.
var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

// squares
legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

// text
legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
        return d.toUpperCase();
    });
}); 

















$(function() {
    app.init();
});
