exports.CommitChart = () => {

  // get the data
  // the rest of the code is wrapped inside d3.json because d3.json is async
  // TODO: take out hardcoded value and replace it with a variable
  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }

    // set dimensions
    var w = 600;
    var h = 320;
    var pad = 20;
    var left_pad = 100; //TEMPORARY
    var barWidth = Math.floor(w / 7) - 1; // ADJUST WITH PADDING HERE

    // set the values for the graph's x-axis
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // set placeholders for received data
    var currentWeekCommits;
    var commitsPairedWithDays = [];

    // Data = all of the weeks of the past year and how many commits are in each week
    // Grab the last week's commit data
    // It looks like this: {total: 35, days: [5, 9, 19, 2, 0, 0, 0]}
    currentWeekCommits = data[data.length - 1];
    for (var i = 0; i < 7; i++) {
      commitsPairedWithDays.push([ week[i], currentWeekCommits.days[i] ]);
    }

    // create container / svg
    var svg = d3.select("#commit-charts")
      .append("svg")
        .attr("width", w)
        .attr("height", h);

    // set the scales
    var x = d3.scale.ordinal()
      .domain(week)
      .rangePoints( [left_pad, w-pad] );
    var y = d3.scale.linear()
      .domain(
        [d3.max( currentWeekCommits.days,
          (d) => { return d; })
        , 0])
      .range( [h, 0] );

    // set the axes
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    // draw the axes
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + (h-pad) + ")")
      .style({
        fill: 'none',
        stroke: '#333'
      })
      .call(xAxis);
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (left_pad-pad) + ", 0)")
      .call(yAxis);

    // the stage is set -- add the data
    svg
      .selectAll('rect')
      .data(commitsPairedWithDays)
      .enter()
        .append('rect')
          .attr('x', (d) => x(d[0]) )
          .attr('y', (d) => h - y(d[1]) )
          .attr('width', barWidth )
          .attr('height', (d) => y(d[1]) );
  });
};


// commitCount.selectAll('rect')
//       .data((d) => {return [d]})
//     .enter().append('rect')
//       .attr('x', (d) => {return -barWidth / 2})
//       .attr('width', barWidth)
//       .attr('y', y)
//       .attr('height', (value) => (height - y(value)))
//       .text((d) => (d.toString()));






  //   .append('g')
  //     .attr('transform', `translate(${margin.left}, ${margin.top})`)
  //     .attr('class', 'commit-chart');

  // // Create the container that holds all of the bars in the bar graph
  // var commitCounts = svg.append('g')
  //     .attr('class', 'commitCounts');



  //     commitCount.selectAll('rect')
  //         .data((d) => {return [d]})
  //       .enter().append('rect')
  //         .attr('x', (d) => {return -barWidth / 2})
  //         .attr('width', barWidth)
  //         .attr('y', y)
  //         .attr('height', (value) => (height - y(value)))
  //         .text((d) => (d.toString()));




  //     svg.selectAll('circle')
  //       .data(commitData)
  //       .enter()
  //         .append('circle')
  //           .attr('cx', function(d) {
  //             return x(d[0]);
  //           })
  //           .attr('cy', function(d) {
  //             return y(d[1]);
  //           });

  // y.domain([0, d3.max(currentWeekCommits.days, (d) => {return d;})]);
  // var commitsMax = d3.max(currentWeekCommits.days)
  // let i = 0;
  // var commitCount = commitCounts.selectAll('.commit-count')
  //     .data(currentWeekCommits.days)
  //   .enter().append('g')
  //     .attr('class', 'commit-count')
  //     .attr('transform', (commitCount) =>
  //       ("translate(" + '300px' + ", 0)") );
  //       // (commitCount) => (`translate(${x(i++)}, 0)`));
  // i = 0;
  // commitCount.selectAll('rect')
  //     .data((d) => {return [d]})
  //   .enter().append('rect')
  //     .attr('x', (d) => {return -barWidth / 2})
  //     .attr('width', barWidth)
  //     .attr('y', y)
  //     .attr('height', (value) => (height - y(value)))
  //     .text((d) => (d.toString()));

  //   // axes
  //   var xAxis = d3.svg.axis().scale(x).orient("bottom");

  //   // draw the axes and ticks
  //   svg.append("g")
  //     .attr("class", "axis")
  //     .attr("transform", "translate(0, " + (height-20) + ")")
  //     .call(xAxis)
  //     .style({'fill': 'red', 'shapeRendering': 'crispEdges'});

  //   // GRAPH text: Commit count
  //   commitCount.append('text')
  //       .attr('y', height - 4)
  //       .attr('class', 'commit-count-num')
  //       .text((commits) => (commits));
