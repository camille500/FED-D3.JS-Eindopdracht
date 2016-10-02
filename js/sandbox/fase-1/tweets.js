d3.json('data/tweets.json', function(error, data){

  // Nest data into groups -> Group each tweet by the user who tweeted it.
  var tweetData = data.tweets;
  var nestedTweets = d3.nest()
      .key(function(el) {return el.user})
      .entries(tweetData);

  console.log(nestedTweets);

  var testArray = [18,932,51,592,192,615];
  console.log(d3.min(testArray, function(el){return el})); // Returns the min value
  console.log(d3.max(testArray, function(el){return el})); // Returns the max value
  console.log(d3.mean(testArray, function(el){return el}));  // Returns average of values
  console.log(d3.extent(testArray, function(el){return el}));  // Returns min & max as 2 piece array [18, 932]


});
