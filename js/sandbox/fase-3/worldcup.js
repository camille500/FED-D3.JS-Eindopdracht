// Haal de data op en geef die door aan de functie overallTeamViz(data)
function createSoccerViz() {
    d3.csv("data/worldcup.csv", function(data) {
        overallTeamViz(data);
    });

    function overallTeamViz(incomingData) {
        d3.select("svg")
            .append("g") // Group de SVG
            .attr("id", "teamsG")
            .attr("transform", "translate(50,300)")
            .selectAll("g")
            .data(incomingData) // Bind data to g element
            .enter()
            .append("g") // Enters all data in G element
            .attr("class", "overallG")
            .attr("transform",
                function(d, i) {
                    return "translate(" + (i * 50) + ", 0)"
                } // Bepaal de positie
            );
        var teamG = d3.selectAll("g.overallG");

        // Voeg de styling toe
        teamG
            .append("circle").attr("r", 0) // Voegt circle met radius van 0 toe
            .transition()
            .delay(function(d, i) { // Delay is index * 100 miliseconden, zodat alles smooth overloopt
                return i * 100
            })
            .duration(500)
            .attr("r", 40) // circle wordt tijdelijk 40 in radius
            .transition()
            .duration(500)
            .attr("r", 20); // circle gaat terug naar oorspronkelijke grootte

        // Voeg de labels toe
        teamG
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .style("font-size", "10px")
            .text(function(d) {
                return d.team;
            });

        // The d3.keys function returns the names of the attributes of an object as an array.
        var dataKeys = d3.keys(incomingData[0]).filter(function(el) { // Returnt alle elementen die niet "team" of "region" zijn
            return el != "team" && el != "region"; // filter zorgt ervoor dat de 'team' en 'region' worden verwijderd
        });

        d3.select("#controls").selectAll("button.teams") // selecteer de buttons
            .data(dataKeys).enter() // voeg dataKeys (zie hierboven) toe aan empty section
            .append("button")
            .on("click", buttonClick) // Voeg onclick event toe
            .attr('class', 'btn btn-default')
            .html(function(d) { // genereer de buttons als html
                return d;
            });

        function buttonClick(datapoint) { // fired wanneer er op een button wordt geklikt
            var maxValue = d3.max(incomingData, function(d) { // Bepaal max value van geklikte datapoint
                return parseFloat(d[datapoint]); // Zet d[datapoint] toe als max value
            });
            var tenColorScale = d3.scale.category10(["UEFA", "CONMEBOL", "CAF", "AFC"]); // Colors based on categories (.categories10)
            var radiusScale = d3.scale.linear()
                .domain([0, maxValue]).range([2, 20]);
            d3.selectAll("g.overallG").select("circle").transition().duration(1000) // set delay
                .style("fill", function(p) {
                    return tenColorScale(p.region);
                })
                .attr("r", function(d) {
                    return radiusScale(d[datapoint]); // set new radius
                });
        };

        teamG.on("mouseover", highlightRegion2); // Zodra er met de muis over een element wordt gegaan, start functie

        function highlightRegion2(d, i) { // Bepaalt wat er moet gebeuren zodra een element wordt gehighlight
            var teamColor = d3.rgb("pink") // zet kleur om in RGB formaat
            d3.select(this).select("text").classed("highlight", true).attr("y", 10) // Verander class en geef positie mee
            d3.selectAll("g.overallG").select("circle")
                .style("fill", function(p) {
                    return p.region == d.region ?
                        teamColor.darker(.75) : teamColor.brighter(.5) // Set color voor elke region die met elkaar overeen komen (lichter of donkerder)
                })
            this.parentElement.appendChild(this); // Append bovenstaande aan het huidige element
        }

        teamG.on("mouseout", unHighlight) // Fired als de muis het element verlaat.

        function unHighlight() { // Haal highlight weer weg zodra muis het vlak verlaat
            d3.selectAll("g.overallG").select("circle").attr("class", "");
            d3.selectAll("g.overallG").select("text")
                .classed("highlight", false).attr("y", 30);
        };

        d3.text("modal.html", function(data) {
            d3.select("body").append("div").attr("id", "modal").html(data); // laad het externe bestand modal.html in en append hem in een div
        });

        teamG.on("click", teamClick); // on click - > start onderstaande function

        function teamClick(d) {
            d3.selectAll("td.data").data(d3.values(d)) // Select alle td's met class data uit modal.html
                .html(function(p) { // Append voor elke data point de waarde aan geselecteerd element
                    return p
                });
        };

      };
};

createSoccerViz()




// d3.selectAll("g.overallG").insert("image", "text")
//     .attr("xlink:href", function(d) {
//         return "img/" + d.team + ".png";
//     })
//     .attr("width", "45px").attr("height", "20px").attr("x", "-22")
//     .attr("y", "-10");
