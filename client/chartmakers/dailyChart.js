//@TODO: decide what to do in case of a tie!
// The obvious thing is to opacity-1/2 (or 1/4) 2 exactly overlapping rects

module.exports = (data) => {

  // EXAMPLE OF DATA COMING IN:
  data = [24, 12];

  var mostCommits = Math.max(...data);

  // HARDCODED FOR NOW
  var users = ['@adamrgisom', '@msmith9393'];

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
  if (data.length === 0) {
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
    .data(data)
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
      .data(data)
      .enter()
        .append('text')
        .attr('x', (d, i) => xScale(users[i]) + barWidth/2 + 4)
        .attr('y', (d) => yScale(d) - 11)
        .text((d) => d > 0 ? d.toString() : '');

    // display placeholder for winner graphic
    var placeOfWinner_x = data[0]===mostCommits ? 0 : 1;
    var placeOfWinner_y = data[placeOfWinner_x];

    svg.append('text')
      .attr('x', () => xScale(users[placeOfWinner_x]) + barWidth/2 + 40)
      .attr('y', () => yScale(placeOfWinner_y) - 11)
      .text('winner');
};
