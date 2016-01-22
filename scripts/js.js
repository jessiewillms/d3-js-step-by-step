var app = {};
app.init = function() {};


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


var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;


var color = d3.scale.ordinal()
    .range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);


var svg = d3.select('.chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');




























$(function() {
    app.init();
});
