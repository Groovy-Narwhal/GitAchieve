module.exports = (data) => {

  // get the right data in the right places
  data = data[0];
  var users = [ data[0][0], data[1][0] ];
  var commits = [ data[0][1], data[1][1] ];

  // get most commits for scaling
  var mostCommits = Math.max(...commits);

  // set dimensions
  var pad = 30;
  var w = 600 - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor((w-3*pad)/users.length) - 3;

  var svg = d3.select("#commit-charts svg");

  // blank out the svg to re-render it
  svg.selectAll('*').remove();

  // if there is NO recent activity, don't draw a graph
  // just write text saying 'no recent activity' in an ellipse (?)
  if (commits.length === 0) {
    svg.append('text')
      .text('no recent activity on this repo!')
      .attr('x', w/2)
      .attr('y', h/2)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px');
    return;
  }

  // set the scales
  var xScale = d3.scale.ordinal()
    .domain(users)
    .rangeRoundBands( [pad*2, w-pad] );
  var yScale = d3.scale.linear()
    .domain([mostCommits, 0])
    .range( [pad, h-pad*2] );

  // set the axes
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // draw the axes
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

  // declare colors array
  var colors = [ 'red', 'steelblue'];

  // add the bars in the bar graph
  var g = svg.selectAll(".bars")
    .data(commits)
    .enter()
      .append("g")
      for (var j = 0; j < users.length; j++) {
        g.append("rect")
          .attr('fill', (d, i) => colors[i])
          .attr('x', (d, i) => xScale(users[i]))
          .attr('y', (d) => yScale(d))
          .attr('width', () => barWidth)
          .attr('height', (d) => yScale(0) - yScale(d))
      }

  // (add the bars, continued) update selection (may be buggy, not used/tested)
  g.append("g")
    for (var j = 0; j < users.length; j++) {
      g.append("rect")
        .attr('fill', (d, i) => colors[i])
        .attr('x', (d, i) => xScale(users[i]))
        .attr('y', (d) => yScale(d))
        .attr('width', () => barWidth)
        .attr('height', (d) => yScale(0) - yScale(d))
    }

    // add text labels for # of commits (when greater than 0)
    svg.append('g')
      .selectAll('text')
      .data(commits)
      .enter()
        .append('text')
        .attr('x', (d, i) => xScale(users[i]) + barWidth/2 + 4)
        .attr('y', (d) => yScale(d) - 11)
        .text((d) => d > 0 ? d.toString() : '');

    // display placeholder for winner graphic
    var placeOfWinner_x = commits[0]===mostCommits ? 0 : 1;
    var placeOfWinner_y = commits[placeOfWinner_x];

    svg.append('text')
      .attr('x', () => xScale(users[placeOfWinner_x]) + barWidth/2 + 40)
      .attr('y', () => yScale(placeOfWinner_y) - 11)
      .text('winner');
};
