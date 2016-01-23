var app = {
    dataObject: {}
};

'use strict';

app.init = function() {

    var url = "https://spreadsheets.google.com/feeds/list/1Ihq90tIob-3NmZcURoKzuzKa6QYHejE-V7mfbGHBSHw/1/public/values?alt=json-in-script&callback=?";

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

var analyseData = function(data) {

    var epnumArry = [],
        seasonArry = [],
        epArry = [];

    for (var i = 0; i < data.feed.entry.length; i++) {

        var epnum = data.feed.entry[i].gsx$epnum.$t,
            season = data.feed.entry[i].gsx$season.$t,
            ep = data.feed.entry[i].gsx$ep.$t;

        if (epnum != "" && epnum != NaN && epnum !== "tk") {
            epnumArry.push(parseInt(epnum));
        };
        if (season != "" && season != NaN && season != isNaN && season !== "tk") {
            seasonArry.push(parseInt(season));
        };

        if (ep != "" && ep != NaN && ep != isNaN && season !== "tk") {
            epArry.push(ep);
        };

    };

    _.each(epnumArry, function(k, i) {
        app.dataObject[k] = seasonArry[i];
    });


    console.log(app.dataObject)

    makeChart(); // call the function to make the chart

}

var makeChart = function() {

    var diameter = 500;

    var svg = d3.select('.chart').append('svg')
        .attr('width', diameter)
        .attr('height', diameter);

    var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .padding(3)
        .value(function(d) {
            return d.size;
        })

    console.log(app.dataObject);

    var dataOb = app.dataObject;

    var processData = function(dataOb) {

        var obj = dataOb;

        var newDataSet = [],
            bubble_classname = "";

        for (var prop in obj) {

            // console.log(prop)

            if (prop <= 7) {
                bubble_classname = 'early'
            } else if (prop <= 16) {
                bubble_classname = 'mid'
            } else {
                bubble_classname = 'late'
            }
            newDataSet.push({
                name: prop,
                className: bubble_classname,
                size: obj[prop] // uses key+value pair, second (val)
            });

            // console.log(newDataSet)

        }
        return {
            children: newDataSet
        };
    }


    var nodes = bubble.nodes(processData(dataOb))
        .filter(function(d) {
            return !d.children;
        });

    // console.log('you are here')

    var viz = svg.selectAll('circle')
        .data(nodes, function(d) {
            return d.name;
        })

    viz.enter().append('circle')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('r', function(d) {
            return d.r;
        })
        .attr('class', function(d) {
            return d.className;
        })

    // create some hover! 

    var tooltips = d3.select('.chart')
        .append('div')
        .attr('class', 'tooltip')

    tooltips.append('div')
        .attr('class', 'ep-num')

    tooltips.append('div')
        .attr('class', 'season-part')

    tooltips.append('div')
        .attr('class', 'sason-num')

    var circle = svg.selectAll('circle');
    
    circle.on('mouseover',function( d ){
        console.log(d);

        tooltips.select('.ep-num').html( "Ep number: " +  d.name )
        tooltips.select('.season-part').html( "Part of the season: " +  d.className )
        tooltips.select('.sason-num').html( "Season number: " +  d.size )
        tooltips.style('display', 'block');
    })

}

$(function() {
    app.init();

});
