var app = {};

'use strict';

app.init = function() {

    /*---------------------------------------------------------------
    get the google sheet key + concat it back into url link
    ---------------------------------------------------------------*/
    var url_link = 'https://docs.google.com/spreadsheets/d/15tqoPf0lRqzZxrlCMoO6Pb1LZbwtQEi8lc8rkHKJs8Q/edit#gid=0',

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

    console.log(data)

    makeChart();

};

/*---------------------------------------------------------------
make the chart
---------------------------------------------------------------*/
var makeChart = function() {

    var chart = d3.select(".chart")
        .data(data)

   
    chart.html("Hello, world!");

};


$(function() {
    app.init();

});
