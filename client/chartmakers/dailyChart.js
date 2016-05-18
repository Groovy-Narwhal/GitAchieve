import moment from 'moment';

module.exports = (data, location) => {

  // get the data in the right 'shape'
  data = data[0];
  var repos = [ data[0][0], data[0][1] ];
  var users = [ data[1][0], data[2][0] ];
  var commits = [ data[1][1], data[2][1] ];

  console.log('repos, users, and commits IN DAILY CHART:', repos, users, commits);

  // calculate most commits for scaling
  var mostCommitsUser1 = Math.max(...commits[0]);
  var mostCommitsUser2 = Math.max(...commits[1]);
  var mostCommits = Math.max(mostCommitsUser1, mostCommitsUser2);

  // start the ordering of the week based on what day it is right now
  // NOTE: I foresee a problem slicing off 'Mon', 'Tues' etc if they have 0 days
  // AFTER doing this sorting, if the current day is Monday
  var daysOfTheWeek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var dayOfTheWeekNow = moment().isoWeekday() - 1; // should be -1
  var days = daysOfTheWeek.slice(dayOfTheWeekNow, 7);
  days = days.concat(...daysOfTheWeek.slice(0, dayOfTheWeekNow));

  // NEXT: start the # of commits from the right place
  // We don't want to show leading-zero days (the first few days if they have zero commits)
  var leadingZeroDays = 0, i = 0;
  while (commits[0][i] === 0 && commits[1][i] === 0 && i < 7) {
    leadingZeroDays++;
    i++;
  }
  days = days.slice(0, 7 - leadingZeroDays);
  commits[0] = commits[0].slice(leadingZeroDays, 7);
  commits[1] = commits[1].slice(leadingZeroDays, 7);

  // this block SHOULD be unnecessary now that we know for sure how data is coming in
  // if the data is coming in like [ user1 -> [array with daily data], user 2 -> [...same]],
  // just change it to be tuples like [ day1 -> [user1 that day, user2 that day], day2 -> [user1, user2], ...]
  if (commits.length === users.length) {
    var reconstructData = [];
    for (var i = 0; i < commits[0].length; i++) {
      reconstructData.push([ commits[0][i], commits[1][i] ]);
    }
    commits = reconstructData;
  }

  // set dimensions
  var pad = 30;
  var w = 600 - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor( (w-3*pad) / (days.length * users.length) );

  if (location === 'same chart') {
    var svg = d3.select("#commit-charts svg");
  } else { // location === 'additional chart'
    var svg = d3.select("#optional-extra-chart")
      .append('svg')
      .attr('width', w)
      .attr('height', h + 35); // change + 50 here
  }

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
    .domain(days)
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
          .attr('fill', (d, i) => colors[j])
          .attr('x', (d, i) => xScale(days[i]) + (j * barWidth))
          .attr('y', (d, i) => yScale(d[j]))
          .attr('width', () => barWidth)
          .attr('height', (d, i) => yScale(0) - yScale(d[j]));
      }


  // add text labels for # of commits (when greater than 0)
  svg.append('g')
    .selectAll('text')
    .data(commits)
    .enter()
      .append("g")
      for (var j = 0; j < users.length; j++) {
        g.append('text')
        .attr('x', (d, i) => xScale(days[i]) + (j * barWidth) + barWidth/2 - 2)
        .attr('y', (d) => yScale(d[j]) + 15)
        .text((d) => d[j] > 0 ? d[j].toString() : '');
      }

  // add text labels for winner placeholder for winner that day
  // if neither day had a 'winner', show nothing (ternary in xlink:href)
  svg.append('g')
  .selectAll('image')
  .data(commits)
  .enter()
    .append('image')
    .attr('xlink:href', (d) => {
      return d[0] > 0 || d[1] > 0 ? 'static/assets/trophy.png' : '';
    })
    .attr('x', (d, i) => {
      return xScale(days[i]) + (barWidth/2 - 11) + (d[0] > d[1] ? 0 : barWidth);
    })
    .attr('y', (d) => {
      return d[0] > d[1] ? yScale(d[0]) -25 : yScale(d[1]) -25;
    })
    .attr('height', 25)
    .attr('width', 22);

  // add a legend associating usernames with colors on the graph
  // TO DO: also show repo-names
  for (j = 0; j < users.length; j++) {
    svg.append('rect')
      .attr('fill', () => colors[j])
      .attr('x', 70)
      .attr('y', h - pad + 25 * (j+1))
      .attr('width', 8)
      .attr('height', 8);
    svg.append('text')
      .attr('transform', 'translate(' + (85) + ',' + (h + 25 * j) + ')')
      .text(() => users[j]);
    svg.append('text')
      .attr('transform', 'translate(' + (185) + ',' + (h + 25 * j) + ')') //change x value to +50
      .text(() => repos[j].toString());
  }

};

// <a xlink:href='http://www.gmail.com'>
// draw a rectangle
// holder.append("a")
//     .attr("xlink:href", "http://en.wikipedia.org/wiki/"+word)
//     .append("rect")
//     .attr("x", 100)
//     .attr("y", 50)
//     .attr("height", 100)
//     .attr("width", 200)
//     .style("fill", "lightgreen")
//     .attr("rx", 10)
//     .attr("ry", 10);

