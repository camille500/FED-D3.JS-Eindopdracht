var scatterData = [{
    friends: 5,
    salary: 22000
}, {
    friends: 3,
    salary: 18000
}, {
    friends: 10,
    salary: 88000
}, {
    friends: 0,
    salary: 180000
}, {
    friends: 27,
    salary: 56000
}, {
    friends: 8,
    salary: 74000
}];

var xExtent = d3.extent(scatterData, function(d) { // Bepaal hoogste en laagste waarde in de gegeven data (hoogste & laagste salaris)
    return d.salary;
});
var yExtent = d3.extent(scatterData, function(d) { // Bepaal hoogste en laagste waarde in de gegeven data (hoogste & laagste aantal vrienden)
    return d.friends;
});
var xScale = d3.scale.linear().domain(xExtent).range([0, 500]); // Bepaal het domein en de range
var yScale = d3.scale.linear().domain(yExtent).range([0, 500]);
d3.select("svg").selectAll("circle")
    .data(scatterData).enter().append("circle")
    .attr("r", 10).attr("cx", function(d) {
        return xScale(d.salary);
    }).attr("cy", function(d) {
        return yScale(d.friends);
    });

var yAxis = d3.svg.axis().scale(yScale).orient("right"); // Maak de yAxis aan op basis van de yScale waarden
d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis); // Append in SVG aan g element, geef het een ID en 'call' de axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);

d3.selectAll("#xAxisG").attr("transform", "translate(0,500)"); // zet de X axis op de 'bottom' positie ipv bovenin de SVG


