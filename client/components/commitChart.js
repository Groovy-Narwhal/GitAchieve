

exports.CommitChart = () => {

  // get the data
  // the rest of the code is wrapped inside d3.json because d3.json is async
  // TODO: take out hardcoded value and replace it with a variable
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
      commitsPairedWithDays.push([ week[i], currentWeekCommits.days[i] ]);
    }



    // set dimensions
    var margin = {top: 20, right: 40, bottom: 30, left: 20};
    var pad = 20;
    var w = 600 - 2*pad; //margin.left - margin.right;
    var h = 320 - 2*pad; //margin.top - margin.bottom;
    // var left_pad = 0;
    var barWidth = Math.floor(w/7) - 10; // ADJUST WITH PADDING HERE
    console.log('barWidth:', barWidth);

    // create container / svg
    var svg = d3.select("#commit-charts")
      .append("svg")
        .attr("width", w)
        .attr("height", h);

    // set the scales
    var x = d3.scale.ordinal()
      .domain(week)
      .rangeRoundBands( [pad*2, w] );//Points( [pad, w-pad] );
    var y = d3.scale.linear()
      .domain(
        [d3.max( currentWeekCommits.days,
          (d) => { return d; })
        , 0])
      .range( [pad, h-pad*2] );

    // set the axes
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

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
    svg
      .selectAll('rect')
      .data(commitsPairedWithDays)
      .enter()
        .append('rect')
          .attr('x', (d) => x(d[0]) )
          .attr('y', (d) => y(d[1]) )
          .attr('width', barWidth )
          .attr('height', (d) => y(0) - y(d[1]) );
  });
};
