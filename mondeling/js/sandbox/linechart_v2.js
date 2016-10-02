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

d3.json('data/data.json', drawChart);

function drawChart(error, data) {

    cleanData(data); // Data opschonen

    var NL = d3.locale(nl_NL);

    var xDomain = d3.extent(data, function(d) {
        return d.datum;
    }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data

    var xScale = d3.time.scale().domain(xDomain).range([15, 1050]); // xScale met ingebouwde margins
    var yScale = d3.scale.linear().domain([-0.75, 30]).range([600, 15]); // yScale met ingebouwde margins

    var xAxis = d3.svg.axis() // xAxis instellen
        .scale(xScale)
        .orient('bottom')
        .tickSize(600)
        .ticks(filt.length)
        .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's

    var yAxis = d3.svg.axis() // yAxis instellen
        .scale(yScale)
        .orient('right')
        .ticks(5)
        .tickSize(1050);

    // xAxis toevoegen aan chart
    d3.select("svg").append("g") // Group aanmaken
        .attr("id", "xAxis")
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

    // Punten in chart zetten op basis van aantal sigaretten per datum
    d3.select("svg").selectAll("circle.sigaretten")
        .data(data) // Maakt lege section aan voor elke datapoint
        .enter().append("circle") // Binds de data per datapoint aan een circle element
        .attr("class", "sigaretten") // Class 'sigaretten' toevoegen
        .attr("r", 6) // Radius van 5px per circle element
        .attr("cx", function(d) {
            return xScale(d.datum);
        }) // Bepaal xAxis positie op basis van datum van elk datapunt
        .attr("cy", function(d) {
            return yScale(d.sigaretten);
        }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
        .style("fill", "#e74c3c"); // Kleur van de punten

    // Punten in chart zetten op basis van aantal sigaretten per datum
    d3.select("svg").selectAll("circle.alcohol")
        .data(data) // Maakt lege section aan voor elke datapoint
        .enter().append("circle") // Binds de data per datapoint aan een circle element
        .attr("class", "alcohol") // Class 'sigaretten' toevoegen
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


    // sigarettenLine.interpolate(chartstyle);
    // alcoholLine.interpolate(chart);

    d3.select("svg")
        .append("path")
        .attr("d", sigarettenLine(data)) // Needs an X & Y value to draw the lines
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

    d3.select("svg")
        .append("path")
        .attr("d", alcoholLine(data)) // Needs an X & Y value to draw the lines
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

    function update() {

        var max = new Date('Sat Sep 12 2016 00:00:00 GMT+0200 (CEST)');

        var subset = data.filter(function(d) {
            return d.datum < max;
        });

        console.log(subset);

        var alcohol = d3.select('svg').selectAll('circle.alcohol').data(subset);
        var sigaretten = d3.select('svg').selectAll('circle.sigaretten').data(subset);
        var xNew = d3.select('svg').selectAll('g#xAxis');

        var xDomainNew = d3.extent(subset, function(d) {
            return d.datum;
        }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data
        console.log(xDomainNew);
        var xScaleNew = d3.time.scale().domain(xDomainNew).range([15, 1050]); // xScale met ingebouwde margins

        var xAxisNew = d3.svg.axis() // xAxis instellen
            .scale(xScaleNew)
            .orient('bottom')
            .tickSize(600)
            .ticks(subset.length)
            .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's

        console.log(subset.length);

        xNew.call(xAxisNew) // call X axis en voeg toe aan group element in SVG met ID 'xAxisG'
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 615) // Positie van de labels
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)") // Draai labels om
            .style("text-anchor", "start");

        alcohol.enter().append('circle.alcohol');
        alcohol.exit().remove();

        sigaretten.enter().append('circle.sigaretten');
        sigaretten.exit().remove();

        var sigarettenNew = d3.svg.line()
            .x(function(d) {
                return xScaleNew(d.datum)
            }) // Points to scaled day value of each data point
            .y(function(d) {
                return yScale(d.sigaretten)
            }); // Points to scaled amount of given data value of each data point

        var alcoholNew = d3.svg.line()
            .x(function(d) {
                return xScaleNew(d.datum)
            }) // Points to scaled day value of each data point
            .y(function(d) {
                return yScale(d.alcohol)
            }); // Points to scaled amount of given data value of each data point

        d3.select('svg').selectAll("path.sigaretten") // change the line
            .attr("d", sigarettenNew(subset))
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

        d3.select('svg').selectAll("path.alcohol") // change the line
            .attr("d", alcoholNew(subset))
            .attr('class', 'alcohol')
            .attr("fill", "none")
            .attr("stroke", "#3498DB")
            .attr("stroke-width", 3)
            .on('mouseover', function(d) {
                d3.select(this).style('stroke', 'black');
                d3.selectAll('circle.alcohol').style('fill', 'black');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('stroke', '#3498DB');
                d3.selectAll('circle.alcohol').style('fill', '#3498DB');
            });


        alcohol.attr("class", "alcohol") // Class 'sigaretten' toevoegen
            .attr("r", 6) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScaleNew(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.alcohol);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", "#3498DB"); // Kleur van de punten

        sigaretten.attr("class", "sigaretten") // Class 'sigaretten' toevoegen
            .attr("r", 6) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScaleNew(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.sigaretten);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", "#e74c3c"); // Kleur van de punten

    }

    update();


    function cleanData(d) {
        d.forEach(function(d) {
            d.datum = new Date(d.datum);
            // console.log(d.datum);
            d.sigaretten = Number(d.sigaretten);
            d.bier = Number(d.bier);
            d.wijn = Number(d.wijn);
            d.sterk = Number(d.sterk);
            d.alcohol = d.bier + d.wijn + d.sterk;
        });
    };

}
