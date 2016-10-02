d3.csv('data/movies.csv', steamGraph);

function steamGraph(error, data) { // Functie om chart te 'tekenen'

    var xScale = d3.scale.linear().domain([1, 8]).range([20, 470]);
    var yScale = d3.scale.linear().domain([0, 100]).range([480, 20]);

    var fillScale = d3.scale.linear()
        .domain([0, 5])
        .range(["lightgray", "black"]);

    var n = 0;
    for (x in data[0]) {
        if (x != "day") {
            var movieArea = d3.svg.area()
                .x(function(d) {
                    return xScale(d.day);
                })
                .y(function(d) {
                    return yScale(simpleStacking(d, x));
                })
                .y0(function(d) {
                    return yScale(simpleStacking(d, x) - d[x]);
                })
                .interpolate("basis");
            d3.select("svg")
                .append("path")
                .style("id", x + "Area")
                .attr("d", movieArea(data))
                .attr("fill", fillScale(n))
                .attr("stroke", "none")
                .attr("stroke-width", 2)
                .style("opacity", .5);
            n++;
        };
    };

    function simpleStacking(incomingData, incomingAttribute) {
        var newHeight = 0;
        for (x in incomingData) {
            if (x != "day") {
                newHeight += parseInt(incomingData[x]);
                if (x == incomingAttribute) {

                    break;
                }
            }
        }
        return newHeight;
    }
};
