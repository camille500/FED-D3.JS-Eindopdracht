/* Bronnen:
   https://teamtreehouse.com/ - D3.JS COURSE
   https://www.lynda.com/D3js-tutorials/Data-Visualization-D3js/162449-2.html - Data Visualization with D3.js
   D3.JS in Action - Manning Publications Co. - BOEK
   http://www.adeveloperdiary.com/d3-js/create-simple-pie-chart-using-d3-js/ - Pie Chart
   http://www.daterangepicker.com/  - Bootstrap daterangepicker
   https://gist.github.com/duopixel/4063326 - Line transitions */

// Functie haalt data op uit JSON bestand
function getData() {
    d3.json('data/data.json', drawChart);
};

function drawChart(error, data) {

    cleanData(data); // Data opschonen
    var NL = d3.locale(nl_NL); // Datum weergave localizeren naar Nederland

    var margin = {
        top: 75,
        right: 25,
        bottom: 75,
        left: 25
    };

    var width = 1015 - margin.right - margin.left;
    var height = 650 - margin.top - margin.bottom;

    var svg = d3.select("#line-svg")
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g');

    var yScale = d3.scale.linear().domain([-0.1, d3.max(data, function(el) {
        return el.sigaretten + 1
    })]).range([height, 15]); // yScale met ingebouwde margins

    var yAxis = d3.svg.axis() // yAxis instellen
        .scale(yScale)
        .orient('right')
        .ticks(5)
        .tickSize(width - 25);

    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    updateChart(data); // Update wordt voor de eerste keer opgestart

    function updateChart(data) {

        // Haal eind & startdatum op uit de daterangepicker op de pagina
        var start = d3.selectAll('input')[0][2].value;
        var end = d3.selectAll('input')[0][3].value;
        if (!start || !end) {
            start = data[0].datum;
            end = data[data.length - 1].datum;
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
            .attr('x', -22);

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
                d3.select(this).attr('fill', 'rgb(237, 236, 126)').transition().duration(50).attr('r', '16');

                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(d.sigaretten + " sigaretten gerookt")
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY + 20) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');

                tooltip.transition()
                    .style('opacity', 0);
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
                d3.select(this).transition().duration(50).attr('r', '16');

                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(d.alcohol + " glazen alcohol gedronken")
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY + 20) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');

                tooltip.transition()
                    .style('opacity', 0);
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
                d3.select(this).transition().duration(50).attr('r', '16');

                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(d.slaap + " uur geslapen")
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY + 20) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).transition().duration(200).attr('r', '4');

                tooltip.transition()
                    .style('opacity', 0);
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

        // bron: https://gist.github.com/duopixel/4063326
        var totalLengthSigaret = sigaretPath.node().getTotalLength(); // Totale lengte van het pad berekenen

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

        // bron: https://gist.github.com/duopixel/4063326
        var totalLengthAlcohol = alcoholPath.node().getTotalLength(); // Totale lengte van het pad berekenen

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

        // bron: https://gist.github.com/duopixel/4063326
        var totalLengthSlaap = slaapPath.node().getTotalLength(); // Totale lengte van het pad berekenen

        slaapPath.attr("stroke-dasharray", totalLengthSlaap + " " + totalLengthSlaap)
            .attr("stroke-dashoffset", totalLengthSlaap)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0); // Hoe hoger, hoe eerder de lijn stopt (voor eind chart)

    };

    // Extra informatie laten zien als er op een datapunt wordt geklikt
    d3.selectAll('circle').on('click', function(d) {
        console.log(d);
        d3.select('#overzicht').style('display', 'block');
        d3.select('#stappen').text(d.stappen);
        d3.select('#humeur-icon').attr('src', 'images/icons/humeur/' + Math.floor(d.humeur) + '.svg');
        d3.select('#humeur').text(d.humeur);
        makePieChart(d); // Piechart maken op basis van data geklikte punt
    });

    function makePieChart(d) {

        // Code geinspireerd door: http://www.adeveloperdiary.com/d3-js/create-simple-pie-chart-using-d3-js/

        // Data opslaan in variable
        var pieData = [{
            name: 'Gelopen:',
            percent: d.km_lopend
        }, {
            name: 'OV:',
            percent: d.km_ov
        }];

        // Dimensies instellen
        var width = 300;
        var height = 300;
        var radius = (width - 20) / 2;

        // Layout voor piechart wordt aangemaakt en aan data punten wordt percentage toegerekend
        var pieChart = d3.layout.pie()
            .value(function(d) {
                return d.percent
            });

        // De radius van de piechart wordt hier bepaald
        var pieArc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Kleurenschaal
        var colors = d3.scale.ordinal()
            .range(['#23234c', '#ce2645']);

        // Instellingen voor de SVG
        var pieSvg = d3.select("#piechart")
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        // Paths worden aangemaakt op basis van de data
        var piePath = pieSvg.selectAll('path').data(pieChart(pieData));
        piePath.enter().append('path');
        piePath.exit().remove();
        piePath.attr('d', pieArc) // path dat moet worden gevolgd (lijnen tekenen)
            .attr('fill', function(d, i) {
                return colors(i)
            })
            .style('stroke', '#804c9b')
            .style('stroke-width', '4px');

        // Tekst wordt toegevoegd aan de chart
        var pieText = pieSvg.selectAll('text')
            .data(pieChart(pieData))
            .enter().append("text")
            .attr("transform", function(d) {
                return "translate(" + pieArc.centroid(d) + ")"; // Middelpunt van de arc wordt berekend
            })
            .attr("text-anchor", "middle") // Aligns de tekst
            .text(function(d) {
                return d.data.name + " " + d.data.percent + " KM";
            })
            .style('fill', 'white')
            .style('font-size', '13.5px');

    };

    d3.select('#apply1').on('click', function() {
        updateChart(data);
    });

    // Laat lijnen wel of niet zien op basis van button click
    d3.select('#slaap-btn').on('click', function() {
        if (d3.selectAll('path.slaap').style('stroke') != 'none') {
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
        if (d3.selectAll('path.sigaretten').style('stroke') != 'none') {
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
        if (d3.selectAll('circle.alcohol').style('fill') != 'none') {
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
