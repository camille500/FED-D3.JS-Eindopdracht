d3.csv("data/boxplots.csv", scatterplot)

function scatterplot(data) {

    var xScale = d3.scale.linear().domain([1, 8]).range([20, 470]); // Domein = maximale bereik, range is aantal pixels dat beschikbaar is.
    var yScale = d3.scale.linear().domain([0, 100]).range([480, 20]);

    var yAxis = d3.svg.axis() // yAxis wordt aangemaaky
        .scale(yScale) // Schaal op basis van eerder gedeclareerde schaal
        .orient('right') // Rechts uitgelijnt
        .ticks(8) // Verdeeld over 8 ticks
        .tickSize(-470); // ??

    d3.select('svg').append('g') // Groupeer de as
        .attr('transform', 'translate(470,0)') // Bepaal de positie van de as
        .attr('id', 'yAxisG') // Wijst een ID toe aan de as
        .call(yAxis); // As wordt hier via een call ingeladen en gebonden aan het G element.

    var xAxis = d3.svg.axis() // Hier wordt de X axis aangemaakt
        .scale(xScale)
        .orient('bottom')
        .tickSize(-470)
        .tickValues([1, 2, 3, 4, 5, 6, 7])  // Waardes voor de ticks wordt hier meegegeven

    d3.select('svg').append('g') // X as wordt gegroupeerd en gecalled
        .attr('transform', 'translate(0,480)')
        .attr('id', 'xAxisG')
        .call(xAxis);

    d3.select("#xAxisG > path.domain").style("display", "none");  // verbergt overbodige ticks

    // V2: Add the boxplot

    d3.select("svg").selectAll("g.box")  // Make empty selections
        .data(data).enter()   // Voeg data toe aan de empty selections
        .append("g")      // Bind de data aan een group element
        .attr("class", "box")  // Voeg class 'box' toe
        .attr("transform", function(d) {  // Bepaal xScale op basis van de dag & yScale op basis van het gemiddelde
            return "translate(" + xScale(d.day) + "," + yScale(d.median) + ")"; // Return per data point en bind aan g element.
        }).each(function(d, i) {    // Bepaal voor elk element de breedte en lengte op basis van kwartaal 1 - kwartaal 3
            d3.select(this)  // Huidige element
              .append('line')  // Voeg lijn toe aan huidige selectie
              .attr('class', 'range') // Geef class 'range' aan lijn
              .attr('x1', 0)  // Bepaalt hoek van de lijn (x1 = startpunt, x2 = eindpunt) Startpositie op X as
              .attr('x2', 0) // Eindpositie op X as
              .attr("y1", yScale(d.max) - yScale(d.median)) // Teken een lijn van de laagste naar de hoogste waarde
              .attr("y2", yScale(d.min) - yScale(d.median)) // ''
              .style('stroke', 'black')
              .style('stroke-width', '4px');

            // Bovenste lijn (max value)
            d3.select(this)
              .append('line') // Voeg nog een lijn toe aan huidige element (voor MAX value)
              .attr('class', 'max') // class 'max'
              .attr('x1', -10) // Startpositie op x as
              .attr('x2', 10)
              .attr("y1", yScale(d.max) - yScale(d.median)) // top-bar van de min-max lijn
              .attr("y2", yScale(d.max) - yScale(d.median))
              .style("stroke", "black")
              .style("stroke-width", "4px");

            // Onderste lijn (min value)
            d3.select(this)
              .append("line")
              .attr("class", "min")
              .attr("x1", -10)
              .attr("x2", 10)
              .attr("y1", yScale(d.min) - yScale(d.median)) // bottom-bar van de min-max lijn
              .attr("y2", yScale(d.min) - yScale(d.median))
              .style("stroke", "black")
              .style("stroke-width", "4px");

            // Voeg de median rectangle toe
            d3.select(this)
              .append("rect") // voeg rectangle toe aan huidige element
              .attr("class", "range") // class 'range'
              .attr("width", 20)  // standaard breedte
              .attr("x", -10)
              .attr("y", yScale(d.q3) - yScale(d.median))  // center rectangle to median value
              .attr("height", yScale(d.q1) - yScale(d.q3))  // bepaal hoogte van rectangle op basis van verschil g1 & g2
              .style("fill", "white")
              .style("stroke", "black")
              .style("stroke-width", "2px");

            d3.select(this)  // median lijn
              .append("line")
              .attr("x1", -10)
              .attr("x2", 10)
              .attr("y1", 0)
              .attr("y2", 0)
              .style("stroke", "darkgray")
              .style("stroke-width", "4px");

        });

}

// d3.select('svg').selectAll('circle.median')
//     .data(data)
//     .enter()
//     .append('circle') // append circle to each data point
//     .attr('class', 'tweets') // add class
//     .attr('r', 5) // declare radius
//     .attr('cx', function(d) {
//         return xScale(d.day)
//     }) // Position X as based on date
//     .attr('cy', function(d) {
//         return yScale(d.median)
//     }) // Position Y as based on gemiddelde
//     .style("fill", "darkgray");
