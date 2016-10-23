// Functie haalt data op uit JSON bestand
function getBarData() {
    d3.json('data/data.json', drawBarChart);
}

function drawBarChart(error, data) {

  console.log(data);

  cleanBarData(data); // Data opschonen

  console.table(data);

  var margin = { top: 75, right: 25, bottom: 75, left: 25 };

  var width = 950 - margin.right - margin.left;
  var height = 700 - margin.top - margin.bottom;

  var svg = d3.select("#barchart-svg")
              .attr('width', width + margin.right + margin.left)
              .attr('height', height + margin.top + margin.bottom)
              .append('g');

  var yScale = d3.scale.linear().domain([-0.1, d3.max(data, function(el){ return el.km_lopend + 1 })]).range([height, 15]); // yScale met ingebouwde margins

  var yAxis = d3.svg.axis() // yAxis instellen
      .scale(yScale)
      .orient('right')
      .ticks(5)
      .tickSize(width - 25);

  function cleanBarData(d) {
      d.forEach(function(d) {
          d.datum = new Date(d.datum);
          d.stappen = Number(d.stappen);
          d.km_lopend = Number(d.km_lopend);
          d.km_ov = Number(d.km_lopend);
          d.humeur = Number(d.humeur);
          d.km_totaal = d.km_lopend + d.km_ov;
      });
  };

};

getBarData();
