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
        .tickValues([1, 2, 3, 4, 5, 6, 7]); // Waardes voor de ticks wordt hier meegegeven

    d3.select('svg').append('g') // X as wordt gegroupeerd en gecalled
        .attr('transform', 'translate(0,480)')
        .attr('id', 'xAxisG')
        .call(xAxis);

    // V2: Add the boxplot

    d3.select("svg").selectAll("g.box")  // Make empty selections
        .data(data).enter()   // Voeg data toe aan de empty selections
        .append("g")      // Bind de data aan een group element
        .attr("class", "box")  // Voeg class 'box' toe
        .attr("transform", function(d) {  // Bepaal xScale op basis van de dag & yScale op basis van het gemiddelde
            return "translate(" + xScale(d.day) + "," + yScale(d.median) + ")"; // Return per data point en bind aan g element.
        }).each(function(d, i) {    // Bepaal voor elk element de breedte en lengte op basis van kwartaal 1 - kwartaal 3
            d3.select(this)  // Huidige element
                .append("rect")
                .attr("width", 20)
                .attr('x', -10)  // Zet het rectangle goed gecentreerd op de lijn
                .attr('y', yScale(d.q3) - yScale(d.median))   // Bepaal start en eindpunt van de rectangle
                .attr("height", yScale(d.q1) - yScale(d.q3))  // Bepaal de hoogte
                .style('fill', 'white')
                .style('stroke', 'black');
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
