var app = {

};

app.init = function() {};

/*-------------------------------------------------------------------default variables -------------------------------------------------------------------*/
var width = 400,
    height = 400,
    radius = Math.min(width, height) / 2,
    donutWidth = 75,
    legendRectSize = 18,
    legendSpacing = 4;

var color = d3.scale.ordinal()
    .range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);

/*-------------------------------------------------------------------creates the SVG -------------------------------------------------------------------*/
var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');


/*-------------------------------------------------------------------creates the pie chart -------------------------------------------------------------------*/
var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

var pie = d3.layout.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);


/*-------------------------------------------------------------------create + get tooltips ready -------------------------------------------------------------------*/
var tooltips = d3.select('.chart')
    .append('div')
    .attr('class', 'tooltip')

tooltips.append('div')
    .attr('class', 'label')

tooltips.append('div')
    .attr('class', 'count')

tooltips.append('div')
    .attr('class', 'percent')

/*-------------------------------------------------------------------load data -------------------------------------------------------------------*/

d3.csv('weekdays.csv', function(error, dataset) {
    dataset.forEach(function(d) {
        d.count = +d.count;
        d.enabled = true;
    });

    var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return color(d.data.label)
        })
        .each(function(d) {
            this._current = d
        });

    /*-------------------------------------------------------------------gets hover ready -------------------------------------------------------------------*/
    path.on('mouseover', function(d) {
        var total = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? d.count : 0;
        }));
        var percent = Math.round(1000 * d.data.count / total) / 10;
        tooltips.select('.label').html(d.data.label);
        tooltips.select('.count').html(d.data.count);
        tooltips.select('.percent').html(percent + '%');
        tooltips.style('display', 'block');
    });

    path.on('mouseout', function(d) {
        tooltips.style('display', 'none');
    });

    path.on('mousemove', function(d) {
        tooltips.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px')
    });

    /*-------------------------------------------------------------------legend
    -------------------------------------------------------------------*/
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

    /*-------------------------------------------------------------------squares
    -------------------------------------------------------------------*/
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)
        .on('click',function(label){
            var rect = d3.select(this);
            var enabled = true;
            var totalEnabled = d3.sum(dataset.map(function(d){
                return (d.enabled) ? 1 : 0;
            }));

            if (rect.attr('class') === 'disabled') {
                rect.attr('class','');
            } else {
                if (totalEnabled < 2) return;
                    rect.attr('class','disabled');
                    enabled = false;
               
            }
            pie.value(function(d){
                if (d.label === label) d.enabled = enabled;
                    return (d.enabled) ? d.count : 0;
            });
        });

    /*-------------------------------------------------------------------text
    -------------------------------------------------------------------*/
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
