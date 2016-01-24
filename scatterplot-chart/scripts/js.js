var app = {};

'use strict';

app.init = function() {

    /*---------------------------------------------------------------
    get the google sheet key + concat it back into url link
    ---------------------------------------------------------------*/
    var url_link = 'https://docs.google.com/spreadsheets/d/1gxPtXuB6sE2YUJzR0EaBkgFLcrI03h0Dsqhk0ws80HA/pubhtml',

        url_key = url_link.substr(39, 44),
        url_start = 'https://spreadsheets.google.com/feeds/list/'
    url_end = '/1/public/values?alt=json-in-script&callback=?'

    url = url_start + url_key + url_end;

    /*---------------------------------------------------------------
    gets the json from google
    ---------------------------------------------------------------*/
    var getData = $.getJSON(url, function(data) {

        }).done(function(data) {
            analyseData(data);
        })
        .fail(function() {
            // console.log("error");
            $('.wrap').html('Error, please refresh the page.');
        })
        .always(function() {
            // console.log("always");
        });

}; // end init

/*---------------------------------------------------------------
reformat the data
---------------------------------------------------------------*/
var analyseData = function(data) {

    makeChart(data);

};

/*---------------------------------------------------------------
make the chart
---------------------------------------------------------------*/
var makeChart = function(data) {

    /*---------------------------------------------------------------
    data
    ---------------------------------------------------------------*/
    var entry = data.feed.entry;

    // make object
    var dataObject = {};
    var dataArry = [];

    // loop over data to create object
    for (var i = 0; i < entry.length; i++) {

        var getData = parseInt(entry[i].gsx$data.$t),
            getLabel = entry[i].gsx$label.$t,
            getY = parseInt(entry[i].gsx$y.$t),
            getX = parseInt(entry[i].gsx$x.$t);

        dataObject['y'] = getY;
        dataObject['x'] = getX;
        dataObject['label'] = getLabel;

        dataArry.push([parseInt(getY), parseInt(getX)]);

    };


    /*---------------------------------------------------------------
    set width + height
    ---------------------------------------------------------------*/
    var w = 625,
        h = 100,
        p = 25;


    console.log(dataArry);

    /*---------------------------------------------------------------
    scales
    ---------------------------------------------------------------*/
    var xScale = d3.scale.linear().nice()
        .domain([0, d3.max(dataArry, function(d) {
            return d[0];
        })])
        .range([0, w - p * 2]);

    var yScale = d3.scale.linear().nice()
        .domain([0, d3.max(dataArry, function(d) {
            return d[1];
        })])
        .range([h - p, p]);

    var rScale = d3.scale.linear().nice()
        .domain([0, d3.max(dataArry, function(d){
            return d[1];
        })])
        .range([2,p - 5]); // use padding so it won't run off the page

    /*---------------------------------------------------------------
    chart | iPOLITICS RED: #751C1E ***or*** (117,28,30)
    ---------------------------------------------------------------*/
    var svg = d3.select('.chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    /*---------------------------------------------------------------
    circles for the chart
    ---------------------------------------------------------------*/
    svg.selectAll('circle')
        .data(dataArry) // use array of arrays, not the object
        .enter() // this goes back and gets *all* the data
        .append('circle')
        .attr('cx', function(d) {
            return xScale(d[0]);
        })
        .attr('cy', function(d) {
            return yScale(d[1]);
        })
        .attr('r', function(d){
            return rScale(d[1]);
        })

    /*---------------------------------------------------------------
    labels
    ---------------------------------------------------------------*/
    svg.selectAll('text')
        .data(dataArry)
        .enter()
        .append('text') // add the text, *then* manipulate
        .text(function(d) {
            return d[0] + ', ' + d[1];
        })
        // positions the text
        .attr('x', function(d) {
            return xScale(d[0]);
        })
        .attr('y', function(d) {
            return yScale(d[1]);
        })
        // styles the text
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");

    /*---------------------------------------------------------------
    axes: D3’s axes are actually functions whose parameters you define
    ---------------------------------------------------------------*/

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
};


(function() {
    app.init();
})();
