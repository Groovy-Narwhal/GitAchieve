//@TODO: take out hardcoded value in d3.json and replace it with a variable
//@TODO: integrate with a style sheet (if desired at that point edit .axis text to have better font)
//@TODO: make the 'week' array depend on the data received / day-of-the-week that the API request was made

exports.CommitChart = () => {

  // get the data
  // the rest of the code is wrapped inside d3.json because d3.json is async
  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }
    // Data = all of the weeks of the past year and how many commits are in each week
    // set placeholders for received data
    var currentWeekCommits;
    var commitsPairedWithDays = [];
    // Grab the last week's commit data
    // It looks like this: {total: 35, days: [5, 9, 19, 2, 0, 0, 0]}
    // days of the week will be used for the graph's x-axis
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    currentWeekCommits = data[data.length - 1];
    for (var i = 0; i < 7; i++) {
      commitsPairedWithDays.push(
      {
        day: week[i],
        user: currentWeekCommits.days[i],
        hardcodedUserTwo: 1
      });
    }
    // OVERWRITE FOR PURPOSES OF PRACTICE
    commitsPairedWithDays[2].hardcodedUserTwo = currentWeekCommits.days[2]+2;
    commitsPairedWithDays[5].hardcodedUserTwo = currentWeekCommits.days[5]+2;

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
    // Find the highest number of commits for any user being compared to set y's max
    var mostCommits = 0;
    for (var i = 0; i < commitsPairedWithDays.length; i++) {
      if (commitsPairedWithDays[i].user > mostCommits)  mostCommits = commitsPairedWithDays[i].user;
      if (commitsPairedWithDays[i].user > mostCommits)  mostCommits = commitsPairedWithDays[i].user;
    }
    var yScale = d3.scale.linear()
      .domain(
        [mostCommits, 0])
        // [d3.max( currentWeekCommits.days,
        //   (d) => { return d; })
        // , 0])
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

    // the stage is set -- add the data
    var g = svg.selectAll(".bars")
        .data(commitsPairedWithDays)
        .enter().append("g")
      // place the first bar
      g.append("rect")
        .attr('x', (d) => xScale(d.day) )
        .attr('y', (d) => yScale(d.user) )
        .attr('width', barWidth )
        .attr('height', (d) => yScale(0) - yScale(d.user) );
      // place the second bar
      g.append("rect")
        .style({ 'fill' : 'red' })
        .attr('x', (d) => xScale(d.day) )
        .attr('y', (d) => yScale(d.hardcodedUserTwo) )
        .attr('width', barWidth )
        .attr('height', (d) => yScale(0) - yScale(d.hardcodedUserTwo) );

    // and finally add text labels for # of commits (when greater than 0)
    svg.append('g')
      .selectAll('text')
      .data(commitsPairedWithDays)
      .enter()
        .append('text')
        .attr('x', (d) => { return  xScale(d.day) + barWidth/2 - 5; } )
        .attr('y', (d) => {
          var higherCount = d.hardcodedUserTwo > d.user ? d.hardcodedUserTwo : d.user;
          if (higherCount === 1)  return yScale(higherCount) - 5;
          return yScale(higherCount) + 15;
        })
        .text( (d) => {
          var higherCount = d.hardcodedUserTwo > d.user ? d.hardcodedUserTwo : d.user;
          if (higherCount > 0) {
            return higherCount.toString();
          }
        });

  });
};
