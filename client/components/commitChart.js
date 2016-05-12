//@TODO: decide what to do in case of a tie! The obvious thing is to opacity-1/2 (or 1/4) 2 exactly overlapping rects

module.exports = (data) => {

  var recentActivity = data.owner.slice(data.owner.length - 13, data.owner.length);
  var beginningOfActivityIndex = 0;
  while (recentActivity[beginningOfActivityIndex] === 0) { 
    beginningOfActivityIndex++; 
  }
  // show only the last 13 weeks of data, or last N weeks if commit activity is only in last N weeks,
  // but if all last 13 weeks had no data, just show a flat graph of 13 weeks of 0 activity
  recentActivity = recentActivity.slice(beginningOfActivityIndex, recentActivity.length);

  // generate time axis -- start with week
  const generateTimeAxisTicks = () => {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var timeAxis = [], lastSunday, timeString;
    if (recentActivity.length > 0) {
      timeAxis.push((today.getMonth()+1) + '/' + today.getDate());
    
      for (var i = 1; i < recentActivity.length; i++) {
          var lastSunday = i === 1 ? new Date(today.setDate(today.getDate()-today.getDay())) : new Date(lastSunday - 604800000);
          timeString = (lastSunday.getMonth()+1) + '/' + lastSunday.getDate();
          timeAxis.push(timeString);
      }
    }
    return timeAxis.reverse();
  };
  var timeAxis = generateTimeAxisTicks();

  /*************
   Some data 'processing'
  *************/
  // calculate mostCommits
  var mostCommits = Math.max(...recentActivity);

  // get sorted data, SET TO SORTED RECENT ACTIVITY
  var sortedRecentActivity = recentActivity;
  // loop through users (each has a recentActivity)
    // per week, sort in ascending order by...
    // create array of tuples where tuple is [commitsByUser[i], i] where i indicates which user
    // sort with function(a,b){ return a[0] > b[0]; }

  /*************
   Actual D3: the setup
  *************/
  // set dimensions
  var pad = 30;
  var w = 600 - 2*pad;
  var h = 360 - 2*pad;
  console.log('timeAxis.length')
  var barWidth = Math.floor(w/timeAxis.length) - 10;

  // create container / svg
  // if (!d3.select("#commit-charts svg")) {
  //   d3.select("#commit-charts")
  //     .append("svg")
  //       .attr("width", w)
  //       .attr("height", h);
  // }
  var svg = d3.select("#commit-charts svg");
  svg.selectAll('*').remove();

  // set the scales
  var xScale = d3.scale.ordinal()
    .domain(timeAxis)
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
  var colors = [
    'lightgreen', 'steelblue', 'red', 'gray', 'black'
  ];

  // add the bars in the bar graph
  // HARDCODE LENGTH TO BE 1, IT SHOULD BE USERS.LENGTH
  var length = 1;
  var skinnyBarWidth = barWidth/length;
  var whichData = length > 2 ? recentActivity : sortedRecentActivity;

  var g = svg.selectAll(".bars")
    .data(whichData)
    .enter()
      .append("g")
      for (var j = 0; j < length; j++) {
        g.append("rect")
          .attr('fill', (d, i) => colors[i])
          .attr('x', (d, i) => {
            return length > 2 ? xScale(timeAxis[i]) + (j * skinnyBarWidth) : xScale(timeAxis[i])
           }) 
          .attr('y', (d) => yScale(d))
          .attr('width', () => {
            return length > 2 ? skinnyBarWidth : barWidth
           })
          .attr('height', (d) => yScale(0) - yScale(d))
      }

  g.append("g")
    for (var j = 0; j < length; j++) {
      g.append("rect")
        .attr('fill', (d, i) => colors[i])
        .attr('x', (d, i) => {
          return length > 2 ? xScale(timeAxis[i]) + (j * skinnyBarWidth) : xScale(timeAxis[i])
         }) 
        .attr('y', (d) => yScale(d))
        .attr('width', () => {
          return length > 2 ? skinnyBarWidth : barWidth
         })
        .attr('height', (d) => yScale(0) - yScale(d))
    }

};




  //   // Store each user's data for each day as a tuple of [id, commits]
  //   // The tuple is because we'll need to keep track of the id/user after we sort
  //   var data = [], sortedData, day, tuple;
  //   for (i = 0; i < 7; i++) {
  //     day = [];
  //     for (j = 0; j < users.length; j++) {
  //       tuple = [];
  //       tuple.push(j); // used as the index
  //       tuple.push(users[j][i]); // a specific user's # of commits on a specific day
  //       day.push(tuple); // the day array now has commit data for each of the users (for that day)
  //     }
  //     data.push(day); // data will have 7 'day' arrays, which will each have n 'tuples' where n = # of users
  //   }
  //   // Sort data so that for each day the users' tuples are sorted in descending order (most-commits-first)
  //   sortedData = JSON.parse(JSON.stringify(data)); // for some reason .slice seems to be changing original after sort
  //   for (i = 0; i < 7; i++) {
  //     sortedData[i].sort(function(a,b) { return a[1] < b[1]; });
  //   }

  //   /*************
  //    D3 continued: the part dealing with the data
  //   *************/

  //   
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

  // });
