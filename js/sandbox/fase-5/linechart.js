d3.csv('data/linechart-tweets.csv', lineChart);

function lineChart(error, data) { // Functie om chart te 'tekenen'

    var xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]); // xScale met ingebouwde margins
    var yScale = d3.scale.linear().domain([0, 35]).range([480, 20]); // yScale met ingebouwde margins

    var xAxis = d3.svg.axis() // declare x Axis
        .scale(xScale)
        .orient('bottom')
        .tickSize(480)
        .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Hard coded x-values corresponding to the days from the loaded data

    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis); // call X axis en voeg toe aan group element in SVG met ID 'xAxisG'

    var yAxis = d3.svg.axis() // declare Y axis
        .scale(yScale)
        .orient('right')
        .ticks(10)
        .tickSize(480);

    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis); // call Y axis en voeg toe aan group element in SVG met ID 'yAxisG'

    // Points on the chart with the amount of tweets
    d3.select("svg").selectAll("circle.tweets")
        .data(data)
        .enter()
        .append("circle") // bind entered data (for each) to circle element in SVG
        .attr("class", "tweets") // class 'tweets'
        .attr("r", 5) // radius of 5px
        .attr("cx", function(d) {
            return xScale(d.day)
        }) // X axis based on the day for each datapoint
        .attr("cy", function(d) {
            return yScale(d.tweets)
        }) // Y axis based on the amount of tweets for each datapoint
        .style("fill", "black");

    // Points on the chart with the amount of retweets
    d3.select("svg").selectAll("circle.retweets")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "retweets")
        .attr("r", 5)
        .attr("cx", function(d) {
            return xScale(d.day)
        })
        .attr("cy", function(d) {
            return yScale(d.retweets)
        }) // Y axis based on the amount of retweets for each datapoint
        .style("fill", "lightgray");

    // Points on the chart with the amount of favorites
    d3.select("svg").selectAll("circle.favorites")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "favorites")
        .attr("r", 5)
        .attr("cx", function(d) {
            return xScale(d.day)
        })
        .attr("cy", function(d) {
            return yScale(d.favorites)
        }) // Y axis based on the amount of favorites for each datapoint
        .style("fill", "gray");

    // Draws line between points with value of amount of tweets
    var tweetLine = d3.svg.line() //
        .x(function(d) {
            return xScale(d.day); // Points to scaled day value of each data point
        })
        .y(function(d) {
            return yScale(d.tweets); // Points to scaled amount of tweets value of each data point
        });
    d3.select("svg")
        .append("path")
        .attr("d", tweetLine(data))
        .attr("fill", "none")
        .attr("stroke", "darkred")
        .attr("stroke-width", 2);

    // Draw lines between dots on chart
    var tweetLine = d3.svg.line()
        .x(function(d) {
            return xScale(d.day) // Points to scaled day value of each data point
        })
        .y(function(d) {
            return yScale(d.tweets) // Points to scaled amount of given data value of each data point
        });
    var retweetLine = d3.svg.line()
        .x(function(d) {
            return xScale(d.day)
        })
        .y(function(d) {
            return yScale(d.retweets)
        });
    var favLine = d3.svg.line()
        .x(function(d) {
            return xScale(d.day);
        })
        .y(function(d) {
            return yScale(d.favorites);
        });

      // Interpolation changes the representation of the given data
      //  tweetLine.interpolate("basis");  <-- Rounded lines
      // retweetLine.interpolate("step"); <-- step lines (trap)
      // favLine.interpolate("cardinal"); <-- Cardinal line

    d3.select("svg")
        .append("path")
        .attr("d", tweetLine(data)) // Needs an X & Y value to draw the lines
        .attr("fill", "none")
        .attr("stroke", "darkred")
        .attr("stroke-width", 2);
    d3.select("svg")
        .append("path")
        .attr("d", retweetLine(data)) // Needs an X & Y value to draw the lines
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 3);
    d3.select("svg")
        .append("path")
        .attr("d", favLine(data)) // Needs an X & Y value to draw the lines
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

}
