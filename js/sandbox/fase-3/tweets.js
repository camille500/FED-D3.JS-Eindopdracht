d3.json('data/tweets.json', function(error, data){ visualize(data.tweets) });

function visualize(data) {

  data.forEach(function(d) {
    console.log(d);
    console.log(d.retweets.length);
    console.log(d.favorites.length);
    d.impact = d.favorites.length + d.retweets.length;    // Bereken impact op basis van aantal retweets & favorites
    d.tweetTime = new Date(d.timestamp);    // Zet de datum van tweets om in datum
  });

  var maxImpact = d3.max(data, function(d) { return d.impact; });  // Bereken de max waarde van de impact die eerder is gedeclareerd
  var startEnd = d3.extent(data, function(d){  // Berekend eerste en laatste datum voor tijdschaal
    return d.tweetTime;
  });

  // Bepaal de schalen
  var timeRamp = d3.time.scale().domain(startEnd).range([20,480]);
  var yScale = d3.scale.linear().domain([0,maxImpact]).range([0,460]);
  var radiusScale = d3.scale.linear().domain([0,maxImpact]).range([1,20]);
  var colorScale = d3.scale.linear().domain([0,maxImpact]).range(["white","#990000"]);


  // Maak de SVG + elementen en voeg labels toe (grouped per data instance)
  var tweetG = d3.select("svg")
                  .selectAll("g")
                  .data(data)
                  .enter()
                  .append("g")
                  .attr("transform", function(d) {
                  return "translate(" +
                  timeRamp(d.tweetTime) + "," + (480 - yScale(d.impact))
                  + ")";
                  });

  tweetG.append("circle")
        .attr("r", function(d) {return radiusScale(d.impact);})
        .style("fill", "#990000")
        .style("stroke", "black")
        .style("stroke-width", "1px");
        tweetG.append("text")  // Set the label per groep element
        .text(function(d) {return d.user + "-" + d.tweetTime.getHours();});
        };
