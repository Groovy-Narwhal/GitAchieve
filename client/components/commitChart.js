//@TODO: take out hardcoded value in d3.json and replace it with a variable
//@TODO: integrate with a style sheet (if desired at that point edit .axis text to have better font)
//@TODO: make the 'week' array depend on the data received / day-of-the-week that the API request was made
//@TODO: make sure we don't get an error relating to the d3.json having not returned

// @TODO (extended note) When more than two users are shown at once, we're going to shift to a
// different drawing block that's actually simpler in a way: they won't overlap,
// instead they'll be side by side which just means smaller widths (barWidth / n for n users)

exports.CommitChart = () => {

  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }

    /*************
     Data storage stuff
    *************/

    // Our user's set of data -- unsure how to add a second set in right now
    // We slice off the last week because we decided to care only about the last week of Git activity
    // Data looks something like this: {total: 35, days: [2, 5, 17, 0, 0, 1]}
    var users = [];
    var userCommits = data[data.length - 1];
    users.push(userCommits.days);

    // Dummy second set of data
    var dummy = {total: 35, days: [7, 3, 22, 2, 0, 3, 3]};
    users.push(dummy.days);

    // Days of the week are used in the x-scaling and x-axis
    // We'll want to dynamically generate this from the data in the future
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Declare counter variables that will be used throughout, using i = 0 in place of var i = 0 in loops
    var i, j;

    // Store each user's data for each day as a tuple of [id, commits]
    // The tuple is because we'll need to keep track of the id/user after we sort
    var data = [], sortedData, day, tuple;
    for (i = 0; i < 7; i++) {
      day = [];
      for (j = 0; j < users.length; j++) {
        tuple = [];
        tuple.push(j); // used as the index
        tuple.push(users[j][i]); // a specific user's # of commits on a specific day
        day.push(tuple); // the day array now has commit data for each of the users (for that day)
      }
      data.push(day); // data will have 7 'day' arrays, which will each have n 'tuples' where n = # of users
    }

    // Sort data so that for each day the users' tuples are sorted in descending order (most-commits-first)
    sortedData = JSON.parse(JSON.stringify(data)); // for some reason .slice seems to be changing original after sort
    for (i = 0; i < 7; i++) {
      sortedData[i].sort(function(a,b) { return a[1] < b[1]; });
    }

    // Find the most commits overall as well as the most commits per day
    var mostCommits = 0;
    var mostCommitsPerDay = [];

    for (i = 0; i < 7; i++) {
      var highest = 0, indexHighest = 0; // used for finding most commits for a particular day

      for (j = 0; j < users.length; j++) {
        if (data[i][j][1] > mostCommits) {
          mostCommits = data[i][j][1];
        }
        if (data[i][j][1] > highest) {
          highest = data[i][j][1];
          indexHighest = j;
        }
      }
      mostCommitsPerDay.push(indexHighest);
    }

    /*************
     Actual D3
    *************/

    // set dimensions
    var pad = 20;
    var w = 600 - 2*pad;
    var h = 320 - 2*pad;
    var barWidth = Math.floor(w/7) - 10;
    console.log('barWidth:', barWidth);

    // create container / svg
    var svg = d3.select("#commit-charts")
      .append("svg")
        .attr("width", w)
        .attr("height", h);

    // set the scales
    var xScale = d3.scale.ordinal()
      .domain(week)
      .rangeRoundBands( [pad*2, w] );
    var yScale = d3.scale.linear()
      .domain(
        [mostCommits, 0])
      .range( [pad, h-pad*2] );

    // set the axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    // draw the axes (first is the x axis, second is the y axis)
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + (h-2*pad) + ")")
      .style({
        fill: 'none',
        stroke: '#333'
      })
      .call(xAxis);
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (pad+10) + ", 0)")
      .style({
        fill: 'none',
        stroke: '#333'
      })
      .call(yAxis);

    /*************
     D3 continued: the part dealing with the data
    *************/

    var g = svg.selectAll(".bars")
      .data(sortedData)
      .enter()
        .append("g")

    for (j = 0; j < users.length; j++) {
      g.append("rect")
        .attr('fill', (d) => {
          return d[j][0]===0 ? 'lightgreen' : 'steelblue'
        })
        // .attr('opacity', (d) => {  // hard to see how 0.65 opacity is a good idea
        //   return j===0 ? 0.65 : 1  // (double the # of colors = confusing)
        // })
        .attr('x', (d, i) => xScale(week[i]) ) // i is being used as a d3 function param, not as a counter
        .attr('y', (d) => {
          return yScale(d[j][1])
         })
        .attr('width', barWidth )
        .attr('height', (d) => {
          return yScale(0) - yScale(d[j][1])
        })
    }

    // add text labels for # of commits (when greater than 0)
    svg.append('g')
      .selectAll('text')
      .data(sortedData)
      .enter()
        .append('text')
        .attr('x', (d, i) => {
          return  xScale(week[i]) + barWidth/2 - 5;
        })
        .attr('y', (d) => {
          return d[0][1]===1 ? yScale(d[0][1]) - 5 : yScale(d[0][1]) + 15
        })
        .text((d) => {
          return d[0][1] > 0 ? d[0][1].toString() : ''
        });

      // add indicators

  });
};
