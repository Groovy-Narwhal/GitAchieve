//@TODO: decide what to do in case of a tie!
// The obvious thing is to opacity-1/2 (or 1/4) 2 exactly overlapping rects

module.exports = (data) => {

  // EXAMPLE OF DATA COMING IN:
  data = data[0] || [ [2, 3, 5, 9, 7, 2, 3], [5, 4, 2, 7, 3, 6, 8] ];

  var mostCommitsUser1 = Math.max(...data[0]);
  var mostCommitsUser2 = Math.max(...data[1]);
  var mostCommits = Math.max(mostCommitsUser1, mostCommitsUser2);
  var daysShown = data[0].length;

  // HARDCODED FOR NOW
  var days = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // HARDCODED FOR NOW
  var users = ['@adamrgisom', '@msmith9393'];

  // if the data is coming in like [ user1 -> [array with daily data], user 2 -> [...same]],
  // just change it to be tuples like [ day1 -> [user1 that day, user2 that day], day2 -> [user1, user2], ...]
  if (data.length === users.length) {
    var reconstructData = [];
    for (var i = 0; i < data[0].length; i++) {
      reconstructData.push([ data[0][i], data[1][i] ]);
    }
    data = reconstructData;
  }

  // set dimensions
  var pad = 30;
  var w = 600 - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor( (w-3*pad) / (daysShown * users.length) );

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
    .domain(days)
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
          .attr('fill', (d, i) => colors[j])
          .attr('x', (d, i) => xScale(days[i]) + (j * barWidth))
          .attr('y', (d, i) => yScale(d[j]))
          .attr('width', () => barWidth)
          .attr('height', (d, i) => yScale(0) - yScale(d[j]));
      }


  // add text labels for # of commits (when greater than 0)
  svg.append('g')
    .selectAll('text')
    .data(data)
    .enter()
      .append("g")
      for (var j = 0; j < users.length; j++) {
        g.append('text')
        .attr('x', (d, i) => xScale(days[i]) + (j * barWidth) + barWidth/2 - 2)
        .attr('y', (d) => yScale(d[j]) - 11)
        .text((d) => d[j] > 0 ? d[j].toString() : '');
      }

  // add text labels for winner placeholder for winner that day
    svg.append('g')
    .selectAll('text')
    .data(data)
    .enter()
      .append('text')
      .attr('x', (d, i) => {
        return xScale(days[i]) + 15 + (d[0] > d[1] ? 0 : barWidth);
      })
      .attr('y', (d) => {
        return d[0] > d[1] ? yScale(d[0]) -25 : yScale(d[1]) -25;
      })
      .text('winner');

  // add a legend associating usernames with colors on the graph
    for (j = 0; j < users.length; j++) {
      svg.append('rect')
        .attr('fill', () => colors[j])
        .attr('x', 110 + (w/3) * j)
        .attr('y', h - pad + 15)
        .attr('width', 8)
        .attr('height', 8);
      svg.append('text')
        .attr('transform', 'translate(' + (125 + (w/3) * j) + ',' + (h - 7) + ')')
        .text(() => users[j]);
    }

};
