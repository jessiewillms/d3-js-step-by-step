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
            console.log("error");
            $('.wrap').html('Error, please refresh the page.');
        })
        .always(function() {
            console.log("always");
        });

}; // end init

var analyseData = function(data) {

    var epnumArry = [],
        seasonArry = [];

    for (var i = 0; i < data.feed.entry.length; i++) {
        var epnum = data.feed.entry[i].gsx$epnum.$t,
            season = data.feed.entry[i].gsx$season.$t;

        if (epnum != "" && epnum != NaN) {
            epnumArry.push(parseInt(epnum));
        };
        if (season != "" && season != NaN && season != isNaN) {
            seasonArry.push(parseInt(season));
        };

    };

    _.each(epnumArry, function(k, i) {
        app.dataObject[k] = seasonArry[i];
    });

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

    var data = {
        "countries_msg_vol": {
            "CA": 170,
            "US": 393,
            "CU": 9,
            "BR": 89,
            "MX": 192,
            "Other": 254
        }
    };

    var dataOb = app.dataObject;

    var processData = function(dataOb) {

        var obj = dataOb;

        var newDataSet = [];

        for (var prop in obj) {
            newDataSet.push({
                name: prop,
                className: prop.toLowerCase(), // gets property + uses it as the classname for CSS
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

        console.log('you are here')

    var viz = svg.selectAll('circle')
        .data(nodes, function(d){
            return d.name;
        })

    viz.enter().append('circle')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('r',function(d) {
            return d.r;
        })
        .attr('class',function(d) {
            return d.className;
        })


}



$(function() {
    app.init();

});
