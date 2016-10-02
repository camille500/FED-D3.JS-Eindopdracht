// Functie haalt data op uit JSON bestand
function getData() {
    d3.json('data/data.json', drawChart);
}

function drawChart(error, data) {

    cleanData(data); // Data opschonen
    var NL = d3.locale(nl_NL);

    var margin = { top: 25, right: 75, bottom: 25, left: 75 };
    var height = 1100 - margin.top - margin.bottom;
    var width = 750 - margin.right - margin.left;


    updateChart(data);

    function updateChart(data) {

        var start = d3.selectAll('input')[0][1].value;
        var end = d3.selectAll('input')[0][2].value;
        if (!start || !end) {
            start = data[0].datum;
            end = data[(data.length - 1)].datum;
        }
        var range = [start, end];

        // Laat alleen data binnen de range zien
        var filterData = data.filter(function(d) {
            return d.datum >= new Date(start) && d.datum <= new Date(end);
        });

        var xDomain = d3.extent(filterData, function(d) {
            return d.datum;
        }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data

        var xScale = d3.time.scale().domain(xDomain).range([15, height]); // xScale met ingebouwde margins
        var yScale = d3.scale.linear().domain([-0.75, 30]).range([width, 15]); // yScale met ingebouwde margins

        var xAxis = d3.svg.axis() // xAxis instellen
            .scale(xScale)
            .orient('bottom')
            .tickSize(width)
            .ticks(filterData.length)
            .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's

        var yAxis = d3.svg.axis() // yAxis instellen
            .scale(yScale)
            .orient('right')
            .ticks(5)
            .tickSize(height);

        // xAxis toevoegen aan chart
        d3.select("svg")
            .call(xAxis) // call X axis en voeg toe aan group element in SVG met ID 'xAxisG'
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 615) // Positie van de labels
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)") // Draai labels om
            .style("text-anchor", "start");

        // yAxis toevoegen aan chart
        d3.select("svg").append("g")
            .attr("id", "yAxis")
            .call(yAxis)
            .selectAll("text")
            .attr('x', 1065);

        var sigarettenPoints = d3.select("svg").selectAll("circle.sigaretten").data(filterData);
        var alcoholPoints = d3.select("svg").selectAll("circle.alcohol").data(filterData);

        sigarettenPoints.enter().append("circle"); // Binds de data per datapoint aan een circle element
        sigarettenPoints.exit().remove();

        alcoholPoints.enter().append("circle"); // Binds de data per datapoint aan een circle element
        alcoholPoints.exit().remove();

        sigarettenPoints.attr("class", "sigaretten") // Class 'sigaretten' toevoegen
            .attr("r", 6) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.sigaretten);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", "#e74c3c"); // Kleur van de punten

        alcoholPoints.attr("class", "alcohol") // Class 'sigaretten' toevoegen
            .attr("r", 6) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.alcohol);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", "#3498db"); // Kleur van de punten

        var sigarettenLine = d3.svg.line()
            .x(function(d) {
                return xScale(d.datum)
            }) // Points to scaled day value of each data point
            .y(function(d) {
                return yScale(d.sigaretten)
            }); // Points to scaled amount of given data value of each data point

        var alcoholLine = d3.svg.line()
            .x(function(d) {
                return xScale(d.datum)
            }) // Points to scaled day value of each data point
            .y(function(d) {
                return yScale(d.alcohol)
            }); // Points to scaled amount of given data value of each data point

        var sigaretPath = d3.select("svg").selectAll('path.sigaretten').data(filterData);
        var alcoholPath = d3.select("svg").selectAll('path.alcohol').data(filterData);

        sigaretPath.enter().append("path");
        sigaretPath.exit().remove();

        alcoholPath.enter().append("path");
        alcoholPath.exit().remove();

        sigaretPath.attr("d", sigarettenLine(filterData))
        .attr('class', 'sigaretten')
        .attr("fill", "none")
        .attr("stroke", "#e74c3c")
        .attr("stroke-width", 3)
        .on('mouseover', function(d) {
            d3.select(this).style('stroke', 'black');
            d3.selectAll('circle.sigaretten').style('fill', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke', '#e74c3c');
            d3.selectAll('circle.sigaretten').style('fill', '#e74c3c');
        });

        alcoholPath.attr("d", alcoholLine(filterData)) // Needs an X & Y value to draw the lines
        .attr('class', 'alcohol')
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 3)
        .on('mouseover', function(d) {
            d3.select(this).style('stroke', 'black');
            d3.selectAll('circle.alcohol').style('fill', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke', '#3498db');
            d3.selectAll('circle.alcohol').style('fill', '#3498db');
        });

    };

    d3.select('.applyBtn').on('click', function() {
        updateChart(data);
    });

    // Functie die de data opschoont
    function cleanData(d) {
        d.forEach(function(d) {
            d.datum = new Date(d.datum);
            d.sigaretten = Number(d.sigaretten);
            d.bier = Number(d.bier);
            d.wijn = Number(d.wijn);
            d.sterk = Number(d.sterk);
            d.alcohol = d.bier + d.wijn + d.sterk;
        });
    };
};


// Omzetten van tijd naar NL taal
var nl_NL = {
    "decimal": ".",
    "thousands": ",",
    "grouping": [3],
    "currency": ["€", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%m/%d/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "shortDays": ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
    "months": ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
    "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

getData();
