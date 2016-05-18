module.exports = (data) => {

  // get the data in the right 'shape'
  data = data[0];
  var repos = [ data[0][0], data[0][1] ];
  var users = [ data[1][0], data[2][0] ];
  var commits = [ data[1][1], data[2][1] ];


  // if the competition has been over a week,
  // show weekly view, otherwise daily view
  if (commits[0].length > 6) { // CHANGE THIS TO 7 OR 8

    var numWeeks = Math.ceil(commits[0].length / 7);

    // get date strings
    var now = new Date();
    var weekInMilliseconds = 604800000;
    var timeScale = [];
    for (var weekNum = 0; weekNum < numWeeks; weekNum++) {
      var earlierWeek = new Date(now.getTime() - weekNum * weekInMilliseconds)
      timeScale.push( (earlierWeek.getMonth()+1) + '/' + earlierWeek.getDate());
    }
    timeScale.reverse();

    // bin the data by week
    var weeklyDataUser1 = [];
    var weeklyDataUser2 = [];

    for (var dataWeek = 0; dataWeek < numWeeks; dataWeek++) {

      // sum up weeklyData ending at length-1 - 7*dW, ending at length-7*(dW+1)
      var sumForWeekUser1 = 0;
      var sumForWeekUser2 = 0;
      var length = commits[0].length;

      for (var i = 0; i < 7; i++) {
        var user1 = commits[0][length - 7 * (dataWeek+1) + i];
        var user2 = commits[1][length - 7 * (dataWeek+1) + i];
        if (!isNaN(user1))  sumForWeekUser1 += user1;
        if (!isNaN(user2))  sumForWeekUser2 += user2;
      }
      weeklyDataUser1.push(sumForWeekUser1);
      weeklyDataUser2.push(sumForWeekUser2);
    }

    commits[0] = weeklyDataUser1.reverse();
    commits[1] = weeklyDataUser2.reverse();

    console.log('users', users[0], users[1]);
    console.log('weeklyDataForUser1, weeklyDataForUser2', commits[0], commits[1]);

  } else {

    // start the ordering of the week based on what day it is right now
    var daysOfTheWeek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var dayOfTheWeekNow = new Date().getDay();
    var timeScale = daysOfTheWeek.slice(dayOfTheWeekNow, 7);
    timeScale = timeScale.concat(...daysOfTheWeek.slice(0, dayOfTheWeekNow));

    // start the # of commits from the right place
    // this avoids showing leading-zero days (if they have zero commits in the first few days)
    var leadingZeroDays = 0, i = 0;
    while (commits[0][i] === 0 && commits[1][i] === 0 && i < 7) {
      leadingZeroDays++;
      i++;
    }
    timeScale = timeScale.slice(leadingZeroDays, 7);
    commits[0] = commits[0].slice(leadingZeroDays, 7);
    commits[1] = commits[1].slice(leadingZeroDays, 7);
  }

  // calculate most commits, for scaling
  var mostCommitsUser1 = Math.max(...commits[0]);
  var mostCommitsUser2 = Math.max(...commits[1]);
  var mostCommits = Math.max(mostCommitsUser1, mostCommitsUser2);

  // commit data comes in sorted by user rather than time,
  // like [ user1 -> [array with daily data], user 2 -> [...same]],
  // and we want it to be tuples like [ day1 -> [user1 that day, user2 that day], day2 -> [user1, user2], ...]
  var sortCommitsByTime = (commits) => {
    var reconstructed = [];
    for (var i = 0; i < commits[0].length; i++) {
      reconstructed.push([ commits[0][i], commits[1][i] ]);
    }
    return reconstructed;
  };
  commits = sortCommitsByTime(commits);

  /**************************************************
    Actual D3 stuff
  **************************************************/

  // set dimensions
  // find the actual width of the element, then slice off the 'px' at the end
  // this still will not change live if the user resizes
  var pad = 30;
  var grabWidth = d3.select("#commit-charts svg").style('width').slice(0, -2);
  var w = parseInt(grabWidth,10) - 2*pad;
  var h = 360 - 2*pad;
  var barWidth = Math.floor( (w-3*pad) / (timeScale.length * users.length) );

  // grab reference to the right svg
  var svg = d3.select("#second-chart svg");

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
    .domain(timeScale)
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
  var colors = ['#9fb4cc', '#cccc9f'];

  // add the bars in the bar graph
  console.log('commits is:', commits);

  var g = svg.selectAll(".bars")
    .data(commits)
    .enter()
      .append("g")
      for (var j = 0; j < users.length; j++) {
        g.append("rect")
          .attr('fill', (d, i) => {
            console.log('d, i, j & colors[j] is: ', d, i, j, colors[j]);
            return colors[j];
          })
          .attr('x', (d, i) => xScale(timeScale[i]) + (j * barWidth))
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
        .attr('x', (d, i) => xScale(timeScale[i]) + (j * barWidth) + barWidth/2 - 4)
        .attr('y', (d) => {
          return yScale(d[j]) + (d[j] > 1 ? 15 : 0)
        })
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
      return xScale(timeScale[i]) + (barWidth/2 - 11) + (d[0] > d[1] ? 0 : barWidth);
    })
    .attr('y', (d) => {
      return d[0] > d[1] ? yScale(d[0]) -25 : yScale(d[1]) -25;
    })
    .attr('height', 25)
    .attr('width', 22);

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
      .text(() => users[j]);

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
