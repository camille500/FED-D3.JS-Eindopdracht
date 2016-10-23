/* Bronnen:
   http://www.adeveloperdiary.com/d3-js/create-stacked-bar-chart-using-d3-js/ - Inspiratie voor stackchart code */

// Data ophalen en draw functie starten
function getBarData() {
    d3.json('data/data.json', drawBarChart);
};

function drawBarChart(data) {

    var stackDataFilter = ["km_ov", "km_lopend"]; // Data die uit het json bestand wordt gehaald voor in de stack
    var colorScale = ['#23234c', '#ce2645']; // Kleurenschaal declareren

    cleanBarData(data);
    var nl = d3.locale(nl_NL); // Datum weergave localizeren naar Nederland

    var margin = {
        top: 20,
        right: 25,
        bottom: 75,
        left: 5
    }; // Margins instellen

    // Maten van de SVG instellen
    var width = 995 - margin.right - margin.left;
    var height = 650 - margin.top - margin.bottom;

    // SVG breedte en hoogte instellen
    var svg = d3.select("#barchart-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Positie van de group in SVG bepalen

    var yScale = d3.scale.linear().domain([-0.1, d3.max(data, function(el) {
        return el.km_lopend + 1
    })]).range([height, 15]); // yScale met ingebouwde margins
    var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .25); // Breedte past zich aan aan de hoeveelheid bar's

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

    updateBarChart(data); // Update wordt voor de eerste keer opgestart

    function updateBarChart(data) {

        // Haal eind & startdatum op uit de daterangepicker op de pagina
        var start = d3.selectAll('input')[0][4].value;
        var end = d3.selectAll('input')[0][5].value;
        if (!start || !end) {
            start = data[0].datum;
            end = data[data.length - 1].datum;
        }

        // Gebasseerd op wg3_voorbeeld_update_exit (CMD, Github)
        // Laat alleen data binnen de range zien
        var filterData = data.filter(function(d) {
            return d.datum >= new Date(start) && d.datum <= new Date(end);
        });

        var xDomain = d3.extent(filterData, function(d) {
            return d.datum;
        }); // Zoekt begin (laagste) & eind (hoogste) waarde van de data

        var stackData = stackDataFilter.map(function(c) { // Data wordt verdeeld in 2 arrays, elke array bevat objects per datum met Y waarde van OV en Lopen gescheiden
            return filterData.map(function(d) { // Haalt waarde van gelopen kilometers en ov kilometers op & koppelt deze aan de datum
                return {
                    x: d.datum,
                    y: d[c], // c = de data filter waarden (km_lopend & km_ov)
                    sigaretten: d.sigatten
                };
            });
        });


        var layout = d3.layout.stack()(stackData); // Stack layout wordt hier aan de data gekoppeld

        // X schaal wordt aangemaakt op basis van de filterdata
        xScale.domain(filterData.map(function(d) {
            return d.datum;
        }));

        yScale.domain([0, d3.max(layout[layout.length - 1], function(d) { // Functie wordt voor elk datapunt uitgevoerd
            return d.y0 + d.y; // OV in KM & Lopend in KM worden samengevoegd
        })]);

        // oude assen verwijderen
        svg.selectAll(".xAxis").remove();
        svg.selectAll(".yAxis").remove();

        // X as instellen
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(filterData.length)
            .tickFormat(nl.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's;

        // xAxis oproepen en positioneren
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('text')
            .attr("x", 15) // Positie van de labels
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)") // Draai labels om
            .style("text-anchor", "start"); // align labels

        // yAxis oproepen en positioneren
        svg.append("g").attr("transform", "translate(25,0)")
            .call(yAxis)
            .attr("class", "yAxis")
            .selectAll("text")
            .attr('x', -22);


        // oude stackarea's verwijderen als die er zijn
        svg.selectAll(".stackArea").remove();

        var bar = svg.selectAll(".stackArea")
            .data(layout) // Gemapte data met Y & Y0 waarde
            .enter().append("g")
            .attr("class", "stackArea") // Class wordt toegewezen
            .style("fill", function(d, i) { // De 2 datapunten (OV & Lopen) krijgen een eigen kleur toegewezen om ze van elkaar te onderscheiden
                return colorScale[i];
            });

        // bar's instellen en rectangles toevoegen
        bar.selectAll("rect")
            .data(function(d) { // data binden per datapunt
                return d;
            })
            .enter().append("rect") // Rectangle per datapunt
            .attr("x", function(d) {
                return xScale(d.x); // datum voor de X Schaal
            })
            .attr("y", function(d) {
                return yScale(d.y + d.y0); // Stacken van de bars op basis van 2 y waarden
            })
            .attr("height", 0)
            .attr("class", "data-rect")
            .on('mouseover', function(d, i) {
                d3.select(this).transition().duration(50).attr('r', '16');

                tooltip.transition()
                    .style('opacity', .9);

                tooltip.html(data[i].km_ov + " KM met het OV & " + data[i].km_lopend + " KM gelopen")
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY + 20) + 'px');
            })
            .on('mouseout', function(d) {
                tooltip.transition()
                    .style('opacity', 0);
            })
            .transition()
            .duration(200)
            .delay(function(d, i) {
                return i * 100;
            })
            .attr("height", function(d) {
                return yScale(d.y0) - yScale(d.y + d.y0); // Hoogte van bars bepalen per Y waarde
            })
            .attr("width", xScale.rangeBand()); // Automatisch berekende breedte van de bars

        // Extra informatie laten zien als er op een datapunt wordt geklikt
        d3.selectAll('rect').on('click', function(d, i) {
            console.log(i);
            d3.select('#overzicht2').style('display', 'block');
            d3.select('#stappen2').text(data[i].stappen);
            d3.select('#alcohol').text(data[i].alcohol);
            d3.select('#sigaretten').text(data[i].sigaretten);
            d3.select('#humeur-icon2').attr('src', 'images/icons/humeur/' + Math.floor(data[i].humeur) + '.svg');
            d3.select('#humeur2').text(data[i].humeur);
        });

    };


    // Update bardata op basis van date-range
    d3.select('#apply2').on('click', function() {
        updateBarChart(data);
    });

    // Functie die de data opschoont
    function cleanBarData(d) {
        d.forEach(function(d) {
            d.datum = new Date(d.datum);
            d.km_lopend = Number(d.km_lopend);
            d.km_ov = Number(d.km_ov);
            d.alcohol = d.bier + d.wijn + d.sterk;
        });
    };

};

getBarData()
