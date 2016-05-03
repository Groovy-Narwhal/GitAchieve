exports.UserCommitChart = () => {
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      barWidth = Math.floor(width / 7) - 1;

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

  var commitCounts = svg.append('g')
      .attr('class', 'commitCounts');

  var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // TODO: take out hardcoded value and replace it with a variable
  d3.json("https://api.github.com/repos/Groovy-Narwhal/GitAchieve/stats/commit_activity", (error, data) => {
    const currentWeekCommits = data[data.length - 1];
    x.domain([0, 7]);
    y.domain([0, d3.max(currentWeekCommits.days, (d) => { return d; })]);
    if (error) {
      console.log('There was an error retrieving commit data: ', error);
    }
    var commitsMax = d3.max(currentWeekCommits.days)
    let i = 0;
    var commitCount = commitCounts.selectAll('.commit-count')
        .data(currentWeekCommits.days)
      .enter().append('g')
        .attr('class', 'commit-count')
        .attr('transform', (commitCount) => (`translate(${x(i++)}, 0)`));
    i = 0;

    commitCount.selectAll('rect')
        .data((d) => { return [d]})
      .enter().append('rect')
        .attr('x', (d) => { return -barWidth / 2 })
        .attr('width', barWidth)
        .attr('y', y)
        .attr('height', (value) => { console.log('The height value: ', height - y(value)); return height - y(value) })
        .text((d) => (d.toString()));

    commitCount.append('text')
        .attr('y', height - 4)
        .attr('class', 'commit-count-num')
        .text((commits) => (commits));

    svg.selectAll('.day')
        .data(week)
      .enter().append('text')
        .attr('class', 'day')
        .attr('x', () => (x(i++) + 3))
        .attr('text-anchor', 'middle')
        .attr('y', height + 20)
        .text((day) => ( day ))
    i = 0;
  });
};
