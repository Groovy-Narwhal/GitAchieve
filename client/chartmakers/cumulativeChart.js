module.exports = (data) => {

  // get the right data in the right places
  data = data[0];
  var repos = [ data[0][0], data[0][1] ];
  var users = [ data[1][0], data[2][0] ];
  var commits = [ data[1][1], data[2][1] ];

  // get most commits for scaling
  var mostCommits = Math.max(...commits);

  // set dimensions
  var pad = 30;
  var top = 60;
  // find the actual width of the element, then slice off the 'px' at the end
  // this still will not change live if the user resizes
  var grabWidth = d3.select("#commit-charts svg").style('width').slice(0, -2);
  var w = parseInt(grabWidth,10) - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor((w-3*pad)/users.length) - 3;

  // get reference to svg
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
  // .ticks is used because we only want to display whole numbers
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis()
    .ticks(Math.min(mostCommits, 10))
    .scale(yScale).orient("left");

  // draw the axes
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h-2*pad) + ")")
    .style({
      fill: 'none',
      stroke: '#777'
    })
    .call(xAxis);
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (pad+10) + ", 0)")
    .style({
      fill: 'none',
      stroke: '#777'
    })
    .call(yAxis);

  // declare colors array
  var colors = ['#9fb4cc', '#cccc9f'];

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
        .attr('x', (d, i) => xScale(users[i]) + barWidth/2)
        .attr('y', (d) => {
          return d < mostCommits/20 ? yScale(d) - 11 : yScale(d) + 16;
        })
        .attr('text-anchor', 'middle')
        .text((d) => d > 0 ? d.toString() : '')
        .attr('font-weight', '100')
        .attr('font-size', '14px')
        .attr('fill', 'white');

    // display winner graphic
    var placeOfWinner_x = commits[0]===mostCommits ? 0 : 1;
    var placeOfWinner_y = commits[placeOfWinner_x];

    svg.append('image')
      .attr('xlink:href', 'static/assets/trophy-1-2.png' )
      .attr('x', () => xScale(users[placeOfWinner_x])-11 + barWidth/2)
      .attr('y', () => yScale(placeOfWinner_y) - 25)
      .attr('height', '25')
      .attr('width', '22');


    // add a legend associating usernames with colors on the graph
    // repo names are clickable
    var repoLinks = svg.append('g');

    for (j = 0; j < users.length; j++) {
      svg.append('rect')
        .attr('fill', () => colors[j])
        .attr('x', 70)
        .attr('y', h - pad + 25 * (j+1))
      .attr('width', 8)
        .attr('height', 8);

      svg.append('text')
        .attr('transform', 'translate(' + (85) + ',' + (h + 25 * j + 3) + ')')
        .text(() => users[j])
        .attr('color', '#777');


      repoLinks
        .append('a')
        .attr('xlink:href', 'http://github.com/' + users[j] + '/' + repos[j])
          .append('rect')
          .attr('x', 200)
          .attr('y', h + 25 * j - 14)
          .attr('height', 20)
          .attr('width', 200)
          .style('fill', '#1d9')
          .style('border-radius', '5px');

      repoLinks
        .append('text')
        .attr('x', 300)
        .attr('y', h - pad + 25 * (j+1))
        .style('fill', 'white')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .text(() => repos[j].toString());
    }
};
