exports.CommitChart = () => {
  // Set the attributes of the SVG element and the width of the bars used for each day's commits
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      barWidth = Math.floor(width / 7) - 1;

  // Create a scale function that automatically scales where an element should be places based on its input
  var x = d3.scale.linear()
      .range([barWidth / 2, width - barWidth / 2]);
  var y = d3.scale.linear()
      .range([height, 0]);

  var svg = d3.select('#commit-charts').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'commit-chart');

  // Create the container that holds all of the bars in the bar graph
  var commitCounts = svg.append('g')
      .attr('class', 'commitCounts');

  var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // TODO: take out hardcoded value and replace it with a variable
  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    if (error) {
      // d3.json is an ajax call so if there's an error, we log the error
      console.log('There was an error retrieving commit data: ', error);
    }
    // Data = all of the weeks of the past year and how many commits are in each week
    // Grab the last week's commit data
    const currentWeekCommits = data[data.length - 1];
    // Set the bounds of the x() scaling function. x's domain is [0, 6] because that's how many days are in a week. (0, 1, 2, 3, 4, 5, 6)
    x.domain([0, 6]);
    // Set the bounds of the y() to 0 and the largest amount of commits
    y.domain([0, d3.max(currentWeekCommits.days, (d) => {return d;})]);
    var commitsMax = d3.max(currentWeekCommits.days)
    let i = 0;
    var commitCount = commitCounts.selectAll('.commit-count')
        .data(currentWeekCommits.days)
      .enter().append('g')
        .attr('class', 'commit-count')
        .attr('transform', (commitCount) => (`translate(${x(i++)}, 0)`));
    i = 0;

    commitCount.selectAll('rect')
        .data((d) => {return [d]})
      .enter().append('rect')
        .attr('x', (d) => {return -barWidth / 2})
        .attr('width', barWidth)
        .attr('y', y)
        .attr('height', (value) => (height - y(value)))
        .text((d) => (d.toString()));

    // Commit count
    commitCount.append('text')
        .attr('y', height - 4)
        .attr('class', 'commit-count-num')
        .text((commits) => (commits));

    // Days of the week
    svg.selectAll('.day')
        .data(week)
      .enter().append('text')
        .attr('class', 'day')
        .attr('x', () => (x(i++) + 3))
        .attr('text-anchor', 'middle')
        .attr('y', height + 20)
        .text((day) => (day))
    i = 0;
  });
};
