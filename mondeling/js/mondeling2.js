/* Bronnen:
   https://teamtreehouse.com/ - D3.JS COURSE
   https://www.lynda.com/D3js-tutorials/Data-Visualization-D3js/162449-2.html - Data Visualization with D3.js
   D3.JS in Action - Manning Publications Co. - BOEK
   https://bl.ocks.org/mbostock/3887235 - Pie Chart
   http://www.daterangepicker.com/  - Bootstrap daterangepicker   */

// Functie haalt data op uit JSON bestand
function getData() {
    d3.json('data/data.json', drawChart);
}

function drawChart(error, data) {

    cleanData(data); // Data opschonen
    var NL = d3.locale(nl_NL); // Datum weergave localizeren naar Nederland

    var margin = { top: 75, right: 25, bottom: 75, left: 25 };
    var width = 975 - margin.right - margin.left;
    var height = 700 - margin.top - margin.bottom;


    updateChart(data); // Update wordt voor de eerste keer opgestart

    function updateChart(data) {

        // Haal eind & startdatum op uit de daterangepicker op de pagina
        var start = d3.selectAll('input')[0][1].value;
        var end = d3.selectAll('input')[0][2].value;
        if (!start || !end) {
            start = data[0].datum;
            end = data[(data.length - 1)].datum;
        }

        // Gebasseerd op wg3_voorbeeld_update_exit (CMD, Github)
        // Laat alleen data binnen de range zien
        var filterData = data.filter(function(d) {
            return d.datum >= new Date(start) && d.datum <= new Date(end);
        });

        var xDomain = d3.extent(filterData, function(d) {
            return d.datum;
        }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data

        var xScale = d3.time.scale().domain(xDomain).range([25, width]); // xScale met ingebouwde margins
        var yScale = d3.scale.linear().domain([-0.1, data.length + 3]).range([height, 15]); // yScale met ingebouwde margins

        var xAxis = d3.svg.axis() // xAxis instellen
            .scale(xScale)
            .orient('bottom')
            .tickSize(height)
            .ticks(filterData.length)
            .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's

        var yAxis = d3.svg.axis() // yAxis instellen
            .scale(yScale)
            .orient('right')
            .ticks(5)
            .tickSize(width);

        // xAxis toevoegen aan chart
        d3.select("svg")
            .call(xAxis) // call X axis en voeg toe aan group element in SVG met ID 'xAxisG'
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 575) // Positie van de labels
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)") // Draai labels om
            .style("text-anchor", "start");

        // yAxis toevoegen aan chart
        d3.select("svg").append("g")
            .attr("id", "yAxis")
            .call(yAxis)
            .selectAll("text")
            .attr('x', 0);

        var sigarettenPoints = d3.select("svg").selectAll("circle.sigaretten").data(filterData); // Lege selecties voor data punten aanmaken
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
            .style("fill", "#2c3e50") // Kleur van de punten
            .on('mouseover', function(d) {
                d3.select(this).transition().duration(200).attr('r', '12');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '6');
            });

        alcoholPoints.attr("class", "alcohol") // Class 'sigaretten' toevoegen
            .attr("r", 6) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.alcohol);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", "#f39c12") // Kleur van de punten
            .on('mouseover', function(d) {
                d3.select(this).transition().duration(200).attr('r', '12');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '6');
            });

        // Bron: D3.JS in Action - Manning Publications Co.
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

        var state = d3.select('.soortLine').attr('id');
        console.log(state);

        sigarettenLine.interpolate(state);  // Verander lijnen
        alcoholLine.interpolate(state);


        var sigaretPath = d3.select("svg").selectAll('path.sigaretten').data(filterData);
        var alcoholPath = d3.select("svg").selectAll('path.alcohol').data(filterData);

        sigaretPath.enter().append("path");
        sigaretPath.exit().remove();

        alcoholPath.enter().append("path");
        alcoholPath.exit().remove();

        sigaretPath.attr("d", sigarettenLine(filterData))
        .attr('class', 'sigaretten')
        .attr("fill", "none")
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 3)
        .on('mouseover', function(d) {
            d3.select(this).style('stroke', 'black');
            d3.selectAll('circle.sigaretten').style('fill', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke', '#2c3e50');
            d3.selectAll('circle.sigaretten').style('fill', '#2c3e50');
        });

        alcoholPath.attr("d", alcoholLine(filterData)) // Needs an X & Y value to draw the lines
        .attr('class', 'alcohol')
        .attr("fill", "none")
        .attr("stroke", "#f39c12")
        .attr("stroke-width", 3)
        .on('mouseover', function(d) {
            d3.select(this).style('stroke', 'black');
            d3.selectAll('circle.alcohol').style('fill', 'black');
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke', '#f39c12');
            d3.selectAll('circle.alcohol').style('fill', '#f39c12');
        });

    };

    d3.selectAll('circle.sigaretten').on('click', function(d) {
      makePieChart(d);
    });

    d3.selectAll('circle.alcohol').on('click', function(d) {
      makePieChart(d);
    });

    function makePieChart(d) {

    // BRON: https://bl.ocks.org/mbostock/3887235

        var pieChart = d3.layout.pie();
        var pieData = pieChart([d.sigaretten,d.bier,d.wijn,d.sterk]);
        var color = ["#2c3e50", "#e74c3c", "#3498db", "#16a085"];

        var pieArc = d3.svg.arc();
        pieArc.outerRadius(175);


        d3.select('#pie-date').text("Detail overzicht - " + d.datum.toLocaleDateString());

        d3.select("#piechart")
           .append("g");

        var pieSVG = d3.select('#piechart').selectAll("path").data(pieData);
            pieSVG.enter().append("path");
            pieSVG.exit().remove();

            pieSVG.attr("transform","translate(230,200)")
           .attr("id", "pie-path")
           .attr("d", pieArc)
           .style("fill", function(d,i) { return color[i]; })
           .style("opacity", 1)
           .style("stroke", "#f1f1f1")
           .style("stroke-width", "2px");



    };

    d3.select('.applyBtn').on('click', function() {
        updateChart(data);
    });

    d3.selectAll('.btn-state').on('click', function() {
      d3.selectAll('.soortLine').attr('class', 'btn btn-default btn-state');
      d3.select(this).attr('class', 'btn btn-default btn-state soortLine');
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
// Bron: http://stackoverflow.com/questions/24385582/localization-of-d3-js-d3-locale-example-of-usage
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
