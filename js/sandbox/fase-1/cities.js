d3.csv('data/cities.csv', function(error,data){ createVisualisation(data) });

function createVisualisation(d) {

  // Berekenen van de max waarde uit de data (eerst omzetten naar int.)
  var maxPopulation = d3.max(d, function(el) {
  return parseInt(el.population);}
  );

  // y schaal wordt hier vastgesteld, van 0 tot max waarde uit data
  var yScale = d3.scale.linear().domain([0,maxPopulation]).range([0,460]);
  d3.select("svg").attr("style","height: 480px; width: 600px;");   // SVG styling
  d3.select("svg")
  .selectAll("rect")
  .data(d)  // Maakt een empty selection voor elk data punt.
  .enter()
  .append("rect")  // Elk data punt krijgt een rectangle element toegewezen.
  .attr("width", 50)
  .attr("height", function(d) {return yScale(parseInt(d.population));})  // Hoogte op basis van data.population
  .attr("x", function(d,i) {return i * 60;})   // X as wordt nu ingesteld door index van element * 60
  .attr("y", function(d) {return 480 - yScale(parseInt(d.population));})   // 480 is hoogte van SVG, - d.population om pos. y as te bepalen
  .style("fill", "blue")
  .style("stroke", "red")
  .style("stroke-width", "1px")
  .style("opacity", .25);

}
