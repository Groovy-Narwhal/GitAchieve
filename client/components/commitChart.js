//@TODO: take out hardcoded value in d3.json and replace it with a variable
//@TODO: integrate with a style sheet (if desired at that point edit .axis text to have better font)
//@TODO: make the 'week' array depend on the data received / day-of-the-week that the API request was made
//@TODO: make sure we don't get an error relating to the d3.json having not returned

exports.CommitChart = () => {

  // get the data
  // the rest of the code is wrapped inside d3.json because d3.json is async
  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }

    // Our user's set of data -- unsure how to add a second set in right now
    // Data = all of the weeks of the past year and how many commits are in each week
    var userCommits = data[data.length - 1];
    var userCommitsTotal = userCommits.total;

    // Dummy second set of data:
    var dummy = {total: 35, days: [7, 3, 22, 2, 0, 3, 3]};
    var dummyTotal = dummy.total;

    // Days of the week are used in the x-scaling and x-axis
    // We'll want to dynamically generate this from the data in the future
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Put the data in a useful format
    var dataMatrix = [];
    for (var i = 0; i < 7; i++) {
      dataMatrix.push(
      [
        week[i],
        userCommits.days[i],
        dummy.days[i]
      ]);
    }

    // Find the most commits overall and the most commits per day
    // Line with (k < 3) should change to k < ? where ? is the number of users being shown, plus one
    var mostCommits = 0;
    var mostCommitsPerDay = [];
    for (var j = 0; j < 7; j++) {
      for (var k = 1; k < 3; k++) {
        if (dataMatrix[j][k] > mostCommits)
          mostCommits = dataMatrix[j][k];
      }
    }
    for (var l = 0; l < 7; l++) {
      var highest = 0;
      var indexHighest = 0;
      for (var m = 1; m < 3; m++) {
        if (dataMatrix[l][m] > highest) {
          highest = dataMatrix[l][m];
          indexHighest = m;
        }
      }
      mostCommitsPerDay.push(indexHighest);
    }

    // VISUAL STUFF

    // set dimensions
    var pad = 20;
    var w = 600 - 2*pad;
    var h = 320 - 2*pad;
    var barWidth = Math.floor(w/7) - 10;
    console.log('barWidth:', barWidth);

    // create container / svg
    var svg = d3.select("#commit-charts")
      .append("svg")
        .attr("width", w)
        .attr("height", h);

    // set the scales
    var xScale = d3.scale.ordinal()
      .domain(week)
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


    /* the stage is set -- add the data */
        // .attr('opacity', function(d) { return (d.user > d.hardcodedUserTwo ? 0.5 : 1); })
    /*
      The conditionals in this block are meant to handle the case of TWO side-by-side users.
      The logged-in user will have their data shown in red and their 'opponent' shown in steel-blue
      The logged-in user's data was pushed into matrixData's arrays at index 1, which explains the === 1

      When more than two users are shown at once, we're going to shift to a
      different drawing block that's actually simpler in a way: they won't overlap,
      instead they'll be side by side which just means smaller widths (barWidth / n for n users)
    */
    console.log('dataMatrix', dataMatrix);
    console.log('mostCommitsPerDay', mostCommitsPerDay);

    var g = svg.selectAll(".bars")
        .data(dataMatrix)
        .enter()
          .append("g")

    // place the larger bar
    g.append("rect")
    .attr('fill', 'green')
      .attr('x', (d) => xScale(d[0]) )
      .attr('y', (d) => {
        return yScale(d[1])
       })
      .attr('width', barWidth )
      .attr('height', (d) => {
        return yScale(0) - yScale(d[1])
      })

    // place the smaller bar (over the larger one)
    // g.append("rect")
    //   // .style({ 'fill' : 'red'})
    //   .attr('fill', (d, i) => {
    //     return mostCommitsPerDay[i] === 1 ? 'red' : 'steelblue'
    //   })
    //   .attr('x', (d) => xScale(d[0]) )
    //   .attr('y', (d) => {
    //     return yScale(d[2]);
    //    })
    //   .attr('width', barWidth )
    //   .attr('height', (d) => {
    //     return yScale(0) - yScale(d[2])
    //   });

    // and finally add text labels for # of commits (when greater than 0)
    svg.append('g')
      .selectAll('text')
      .data(dataMatrix)
      .enter()
        .append('text')
        .attr('x', (d) => { return  xScale(d[0]) + barWidth/2 - 5; } )
        .attr('y', (d) => {
          var higherCount = d[2] > d[1] ? d[2] : d[1];
          if (higherCount === 1)  return yScale(higherCount) - 5;
          return yScale(higherCount) + 15;
        })
        .text( (d) => {
          var higherCount = d[2] > d[1] ? d[2] : d[1];
          if (higherCount > 0) {
            return higherCount.toString();
          }
        });

  });
};
