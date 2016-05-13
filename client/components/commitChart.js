//@TODO: decide what to do in case of a tie!
// The obvious thing is to opacity-1/2 (or 1/4) 2 exactly overlapping rects

module.exports = (data) => {

  // EXAMPLE OF DATA COMING IN:
  data = [24, 12];

  var mostCommits = Math.max(...data);

  // HARDCODED FOR NOW
  var users = ['@adamrgisom', '@msmith9393'];

  /*************
   The setup
  *************/
  // set dimensions
  var pad = 30;
  var w = 600 - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor((w-2*pad)/users.length);

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

  // declare colors array, maximum 5
  // Note that if there were only 5 colors, that would mean only up to 5 individuals could get compared.
  var colors = [ 'lightgreen', 'steelblue'];

  // add the bars in the bar graph
  var g = svg.selectAll(".bars")
    .data(data)
    .enter()
      .append("g")
      for (var j = 0; j < 2; j++) {
        g.append("rect")
          .attr('fill', (d, i) => colors[i])
          .attr('x', (d, i) => xScale(users[i]))
          .attr('y', (d) => yScale(d))
          .attr('width', () => barWidth)
          .attr('height', (d) => yScale(0) - yScale(d))
      }

  g.append("g")
    for (var j = 0; j < users; j++) {
      g.append("rect")
        .attr('fill', (d, i) => colors[i])
        .attr('x', (d, i) => xScale(users[i]))
        .attr('y', (d) => yScale(d))
        .attr('width', () => barWidth)
        .attr('height', (d) => yScale(0) - yScale(d))
    }

  //   // add text labels for # of commits (when greater than 0)
  //   svg.append('g')
  //     .selectAll('text')
  //     .data(sortedData)
  //     .enter()
  //       .append('text')
  //       .attr('x', (d, i) => {
  //         return xScale(week[i]) + barWidth/2 + 4
  //       })
  //       .attr('y', (d) => {
  //         return yScale(d[0][1]) - 11
  //         // was formerly (for the 2-person-view) return d[0][1]===1 ? yScale(d[0][1]) - 5 : yScale(d[0][1]) + 15
  //       })
  //       .text((d) => {
  //         return d[0][1] > 0 ? d[0][1].toString() : ''
  //       });

  //   // add color dot indicators above the bars showing who won that day
  //   svg.append('g')
  //     .selectAll('circle')
  //     .data(sortedData)
  //     .enter()
  //       .append('circle')
  //       .attr('cx', (d, i) => {
  //         return xScale(week[i]) + barWidth/2 - 7;
  //       })
  //       .attr('cy', (d) => {
  //         return yScale(d[0][1]) - 15
  //       })
  //       .attr('fill', (d) => {
  //         return colors[ d[0][0] ]
  //       })
  //       .attr('r', 5)
  //       .attr('stroke', 'black');

  //   // add a legend associating usernames with colors on the graph
  //   for (j = 0; j < users.length; j++) {
  //     svg.append('rect')
  //       .attr('fill', () => colors[j])
  //       .attr('x', 50 + 100 * j)
  //       .attr('y', h - pad + 15)
  //       .attr('width', 8)
  //       .attr('height', 8);
  //     svg.append('text')
  //       .attr('transform', 'translate(' + (60 + 100 * j) + ',' + (h - 7) + ')')
  //       .text(() => usernames[j]);
  //   }

};
