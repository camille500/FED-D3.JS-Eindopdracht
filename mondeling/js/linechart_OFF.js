/* Bronnen:
   https://teamtreehouse.com/ - D3.JS COURSE
   https://www.lynda.com/D3js-tutorials/Data-Visualization-D3js/162449-2.html - Data Visualization with D3.js
   D3.JS in Action - Manning Publications Co. - BOEK
   https://bl.ocks.org/mbostock/3887235 - Pie Chart
   http://www.daterangepicker.com/  - Bootstrap daterangepicker   */

// Functie haalt data op uit JSON bestand
function getData() {
    d3.json('data/data.json', drawChart);
};

function drawChart(error, data) {

    cleanData(data); // Data opschonen
    var NL = d3.locale(nl_NL); // Datum weergave localizeren naar Nederland

    var margin = { top: 75, right: 25, bottom: 75, left: 25 };

    var width = 1015 - margin.right - margin.left;
    var height = 650 - margin.top - margin.bottom;

    var svg = d3.select("#line-svg")
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .append('g');

    var yScale = d3.scale.linear().domain([-0.1, d3.max(data, function(el){ return el.sigaretten + 1 })]).range([height, 15]); // yScale met ingebouwde margins

    var yAxis = d3.svg.axis() // yAxis instellen
        .scale(yScale)
        .orient('right')
        .ticks(5)
        .tickSize(width - 25);

    updateChart(data); // Update wordt voor de eerste keer opgestart

    function updateChart(data) {

        // Haal eind & startdatum op uit de daterangepicker op de pagina
        var start = d3.selectAll('input')[0][2].value;
        var end = d3.selectAll('input')[0][3].value;
        if (!start || !end) {
            start = data[0].datum;
            end = data[(data.length - 1)].datum;
        };

        // Gebasseerd op wg3_voorbeeld_update_exit (CMD, Github)
        // Laat alleen data binnen de range zien
        var filterData = data.filter(function(d) {
            return d.datum >= new Date(start) && d.datum <= new Date(end);
        });

        var xDomain = d3.extent(filterData, function(d) {
            return d.datum;
        }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data

        var xScale = d3.time.scale().domain(xDomain).range([25, width]); // xScale met ingebouwde margins

        var xAxis = d3.svg.axis() // xAxis instellen
            .scale(xScale)
            .orient('bottom')
            .tickSize(height - 3)
            .ticks(filterData.length)
            .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's

        // xAxis toevoegen aan chart

        svg.call(xAxis) // call X axis en voeg toe aan group element in SVG met ID 'xAxisG'
        .selectAll("text")
        .attr("y", 0)
        .attr("x", height + 15) // Positie van de labels
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)") // Draai labels om
        .style("text-anchor", "start");

      // yAxis toevoegen aan chart
        svg.append("g").attr("transform", "translate(25,0)")
        .call(yAxis)
        .attr("id", "yAxis")
        .selectAll("text")
        .attr('x', - 22);

        var sigarettenColor = d3.select('#sigaretten-btn').attr('alt');
        var alcoholColor = d3.select('#alcohol-btn').attr('alt');
        var slaapColor = d3.select('#slaap-btn').attr('alt');

        var sigarettenPoints = d3.select('svg').selectAll("circle.sigaretten").data(filterData);
        var alcoholPoints = d3.select('svg').selectAll("circle.alcohol").data(filterData);
        var slaapPoints = d3.select('svg').selectAll("circle.slaap").data(filterData);

        sigarettenPoints.enter().append("circle"); // Binds de data per datapoint aan een circle element
        sigarettenPoints.exit().remove();

        alcoholPoints.enter().append("circle"); // Binds de data per datapoint aan een circle element
        alcoholPoints.exit().remove();

        slaapPoints.enter().append("circle"); // Binds de data per datapoint aan een circle element
        slaapPoints.exit().remove();

        sigarettenPoints.attr("class", "sigaretten") // Class 'sigaretten' toevoegen
            .attr("r", 4) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.sigaretten);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", sigarettenColor) // Kleur van de punten
            .on('mouseover', function(d) {
                d3.select(this).attr('fill', 'rgb(237, 236, 126)').transition().duration(200).attr('r', '16');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');
            });

        alcoholPoints.attr("class", "alcohol") // Class 'sigaretten' toevoegen
            .attr("r", 4) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.alcohol);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", alcoholColor) // Kleur van de punten
            .on('mouseover', function(d) {
                d3.select(this).transition().duration(200).attr('r', '16');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');
            });

        slaapPoints.attr("class", "slaap") // Class 'sigaretten' toevoegen
            .attr("r", 4) // Radius van 5px per circle element
            .attr("cx", function(d) {
                return xScale(d.datum);
            }) // Bepaal xAxis positie op basis van datum van elk datapunt
            .attr("cy", function(d) {
                return yScale(d.slaap);
            }) // Bepaal xAxis positie op basis van het aantal sigaretten per dag
            .style("fill", slaapColor) // Kleur van de punten
            .on('mouseover', function(d) {
                d3.select(this).transition().duration(200).attr('r', '16');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');
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

        var slaapLine = d3.svg.line()
            .x(function(d) {
                return xScale(d.datum)
            }) // Points to scaled day value of each data point
            .y(function(d) {
                return yScale(d.slaap)
            }); // Points to scaled amount of given data value of each data point

        var state = d3.select('.soortLine').attr('id');

        sigarettenLine.interpolate(state); // Verander lijnen
        alcoholLine.interpolate(state);
        slaapLine.interpolate(state);

        var sigaretPath = d3.select("svg").selectAll('path.sigaretten').data(filterData);
        var alcoholPath = d3.select("svg").selectAll('path.alcohol').data(filterData);
        var slaapPath = d3.select("svg").selectAll('path.slaap').data(filterData);

        sigaretPath.enter().append("path");
        sigaretPath.exit().remove();

        alcoholPath.enter().append("path");
        alcoholPath.exit().remove();

        slaapPath.enter().append("path");
        slaapPath.exit().remove();

        sigaretPath.attr("d", sigarettenLine(filterData))
            .attr('class', 'sigaretten')
            .attr("fill", "none")
            .attr("stroke", sigarettenColor)
            .attr("stroke-width", 2)
            .on('mouseover', function(d) {
                d3.select(this).style('stroke', 'rgb(237, 236, 126)');
                d3.selectAll('circle.sigaretten').style('fill', 'rgb(237, 236, 126)');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('stroke', sigarettenColor);
                d3.selectAll('circle.sigaretten').style('fill', sigarettenColor);
            });

        var totalLengthSigaret = sigaretPath.node().getTotalLength();

        sigaretPath.attr("stroke-dasharray", totalLengthSigaret + " " + totalLengthSigaret)
        .attr("stroke-dashoffset", totalLengthSigaret)
        .transition()
          .duration(1000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

        alcoholPath.attr("d", alcoholLine(filterData)) // Needs an X & Y value to draw the lines
            .attr('class', 'alcohol')
            .attr("fill", "none")
            .attr("stroke", alcoholColor)
            .attr("stroke-width", 2)
            .on('mouseover', function(d) {
                d3.select(this).style('stroke', 'rgb(50, 213, 236)');
                d3.selectAll('circle.alcohol').style('fill', 'rgb(50, 213, 236)');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('stroke', alcoholColor);
                d3.selectAll('circle.alcohol').style('fill', alcoholColor);
            });

        var totalLengthAlcohol = alcoholPath.node().getTotalLength();

        alcoholPath.attr("stroke-dasharray", totalLengthAlcohol + " " + totalLengthAlcohol)
        .attr("stroke-dashoffset", totalLengthAlcohol)
        .transition()
          .duration(1000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

        slaapPath.attr("d", slaapLine(filterData)) // Needs an X & Y value to draw the lines
            .attr('class', 'slaap')
            .attr("fill", "none")
            .attr("stroke", "none")
            .attr("stroke-width", 2)
            .on('mouseover', function(d) {
                d3.select(this).style('stroke', slaapColor);
                d3.selectAll('circle.slaap').style('fill', slaapColor);
            })
            .on('mouseout', function(d) {
                d3.select(this).style('stroke', slaapColor);
                d3.selectAll('circle.slaap').style('fill', slaapColor);
            });


      var totalLengthSlaap = slaapPath.node().getTotalLength();

      slaapPath.attr("stroke-dasharray", totalLengthSlaap + " " + totalLengthSlaap)
      .attr("stroke-dashoffset", totalLengthSlaap)
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    };

    d3.selectAll('circle.sigaretten').on('click', function(d) {
      console.log(d);
        d3.select('#stappen').text(d.stappen);
        d3.select('#humeur-icon').attr('src', 'images/icons/humeur/' + Math.round(d.humeur) + '.svg');
        d3.select('#humeur').text(d.humeur);
        makePieChart(d);
    });

    d3.selectAll('circle.alcohol').on('click', function(d) {
        makePieChart(d);
    });

    function makePieChart(d) {

        // BRON: https://bl.ocks.org/mbostock/3887235

        var pieChart = d3.layout.pie();
        var pieData = pieChart([d.km_lopend, d.km_ov]);
        var color = ["#e74c3c", "#3498db"];

        var pieArc = d3.svg.arc();
        pieArc.outerRadius(140);

        var pieSVG = d3.select('#piechart').selectAll("path").data(pieData);
        pieSVG.enter().append("path");
        pieSVG.exit().remove();

        pieSVG.attr("transform", "translate(155,150)")
            .attr("id", "pie-path")
            .attr("d", pieArc)
            .style("fill", function(d, i) {
                return color[i];
            })
            .style("opacity", 1)
            .style("stroke", "#f1f1f1")
            .style("stroke-width", "2px");

        d3.selectAll('#pie-path')
        .append("svg:text").attr("transform", function(d){
              d.innerRadius = 155;
              d.outerRadius = 150;
            return "translate(" + pieArc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
            return 'test';}
            );


    };

    d3.select('#apply1').on('click', function() {
        updateChart(data);
    });

    // Laat lijnen wel of niet zien op basis van button click
    d3.select('#slaap-btn').on('click', function() {
      if(d3.selectAll('path.slaap').style('stroke') != 'none') {
        d3.selectAll('path.slaap').style('stroke', 'none');
        d3.selectAll('circle.slaap').style('fill', 'none');
        d3.select('#slaap-btn').attr('alt', 'none').attr('class', 'btn btn-default');
        updateChart(data);
      } else {
        d3.selectAll('path.slaap').style('stroke', '#FBB1BE');
        d3.selectAll('circle.slaap').style('fill', '#FBB1BE');
        d3.select('#slaap-btn').attr('alt', '#FBB1BE').attr('class', 'btn btn-default slaap-btn-active');
        updateChart(data);
      };
    });

    // Laat lijnen wel of niet zien op basis van button click
    d3.select('#sigaretten-btn').on('click', function() {
      if(d3.selectAll('path.sigaretten').style('stroke') != 'none') {
        d3.selectAll('path.sigaretten').style('stroke', 'none');
        d3.selectAll('circle.sigaretten').style('fill', 'none');
        d3.select('#sigaretten-btn').attr('alt', 'none').attr('class', 'btn btn-default');
        updateChart(data);
      } else {
        d3.selectAll('path.sigaretten').style('stroke', '#F6F5A6');
        d3.selectAll('circle.sigaretten').style('fill', '#F6F5A6');
        d3.select('#sigaretten-btn').attr('alt', '#F6F5A6').attr('class', 'btn btn-default sigaretten-btn-active');
        updateChart(data);
      };
    });

    // Laat lijnen wel of niet zien op basis van button click
    d3.select('#alcohol-btn').on('click', function() {
      if(d3.selectAll('circle.alcohol').style('fill') != 'none') {
        d3.selectAll('circle.alcohol').style('fill', 'none');
        d3.selectAll('path.alcohol').style('stroke', 'none');
        d3.select('#alcohol-btn').attr('alt', 'none').attr('class', 'btn btn-default');
        updateChart(data);
      } else {
        d3.selectAll('circle.alcohol').style('fill', '#5BE4F7');
        d3.selectAll('path.alcohol').style('stroke', '#5BE4F7');
        d3.select('#alcohol-btn').attr('alt', '#5BE4F7').attr('class', 'btn btn-default alcohol-btn-active');
        updateChart(data);
      };
    });

    // Verander de interpolatie van de lijnen op basis van buttonclick
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
