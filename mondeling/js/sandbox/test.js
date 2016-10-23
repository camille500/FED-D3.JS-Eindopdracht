// Data ophalen en draw functie starten
function getBarData(data) {
    d3.json('data/data.json', drawBarChart);
}

function drawBarChart(data) {

    var xData = ["km_lopend", "km_ov"];
    cleanBarData(data);
    var NL = d3.locale(nl_NL); // Datum weergave localizeren naar Nederland

    var margin = {
        top: 75,
        right: 25,
        bottom: 75,
        left: 25
    };

    var width = 950 - margin.right - margin.left;
    var height = 700 - margin.top - margin.bottom;

    var svg = d3.select("#barchart-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .25);

    var y = d3.scale.linear().domain([-0.1, d3.max(data, function(el) { return el.km_lopend + 1 })]).range([height, 15]); // yScale met ingebouwde margins

    var yAxis = d3.svg.axis() // yAxis instellen
        .scale(y)
        .orient('right')
        .ticks(5)
        .tickSize(width - 25);

    var color = ['#E74C3C', '#3498DB'];

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(filterData.lengt)
        .tickFormat(NL.timeFormat("%a %d/%m")); // Ticks op basis van aantal entry's;

    var stackData = xData.map(function(c) {  // Data wordt verdeeld in 2 arrays, elke array bevat objects per datum met Y waarde van OV en Lopen gescheiden
        return data.map(function(d) {
            return {
                x: d.datum,
                y: d[c]
            };
        });
    });


    var dataStackLayout = d3.layout.stack()(stackData);


    x.domain(dataStackLayout[0].map(function(d) {
      console.log(dataStackLayout[0]);
        return d.x;
    }));

    y.domain([0,
            d3.max(dataStackLayout[dataStackLayout.length - 1],
                function(d) { // Functie wordt voor elk datapunt uitgevoerd
                    return d.y0 + d.y;  // OV in KM & Lopend in KM worden samengevoegd
                })
        ])
        .nice();

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('text')
            .attr("x", 10) // Positie van de labels
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)") // Draai labels om
            .style("text-anchor", "start");

        svg.append("g").attr("transform", "translate(25,0)")
            .call(yAxis)
            .attr("id", "yAxis")
            .selectAll("text")
            .attr('x', -22);

    var layer = svg.selectAll(".stack")
        .data(dataStackLayout) // Gemapte data met Y & Y0 waarde
        .enter().append("g")
        .attr("class", "stack") // Class wordt toegewezen
        .style("fill", function(d, i) {  // De 2 datapunten (OV & Lopen) krijgen een eigen kleur toegewezen om ze van elkaar te onderscheiden
            return color[i];
        });

    layer.selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function(d) {
            return x(d.x);
        })
        .attr("y", function(d) {
            return y(d.y + d.y0);
        })
        .attr("height", function(d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());


    d3.select('.applyBtn').on('click', function() {
        updateBarChart(data);
    });

    // Functie die de data opschoont
    function cleanBarData(d) {
        d.forEach(function(d) {
            d.datum = new Date(d.datum);
            d.km_lopend = Number(d.km_lopend);
            d.km_ov = Number(d.km_ov);
        });
    };
}

getBarData();
