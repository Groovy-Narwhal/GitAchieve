import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      reposCommits: [],
      reposContributors: {},
      reposNumCommits: [],
      totalCommits: 0,
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.props.user.username,
          'Authorization': `token ${localStorage.token}`
        }
      }
    }
    this.fetchAllRepoData.call(this)
    // this.getAllRepoData();
  }
  renderTopContributors(i) {
    // console.log('Were inside of the renderTopContributors, ', i, this.state.reposContributors[i]);
    // console.log('And here are the reposContributors: ', this.state.reposContributors);
    return (
      this.state.reposContributors[i].map((contributor) => (
        <div>
          <p>{contributor.login}</p>
          <strong>Number of Contributions</strong>
          <p>{contributor.contributions}</p>
        </div>
      ))
    )
  }
  fetchRepos() {
    return fetch(`https://api.github.com/users/${this.props.user.username}/repos?per_page=100`, this.state.options)
      .then((res) => res.json())
      .then((data) => data)
  }
  fetchContributors(repo) {
    return fetch(repo.contributors_url, this.state.options)
      .then((res) => res.json())
      .then((data) => data);
  }
  fetchAllRepoData(cb) {
    async function renderRepos () {
      var repos = await this.fetchRepos();
      var contributors = [];
      for (var i = 0; i < repos.length; i++) {
        contributors.push(await this.fetchContributors(repos[i]))
      }
      // console.log('These are the repos: ', repos);
      // console.log('These are the contributors: ', contributors);
      var incrementor = 0;
      var reposAndContributors = repos.map((repo) => ({repo: repo, contributors: contributors[incrementor++]}))
      this.setState({repos: reposAndContributors});
      console.log('this.state.repos: ', this.state.repos);
    };
    renderRepos.call(this);
  }
  render() {
    return (
      <div id="data-results-container">
        <h3>Repos</h3>
        {this.state.repos.map((repoData) => (
          <div className="data-result-container">
            <h2>{repoData.repo.name}</h2>
            {repoData.contributors.map((contributor) => (
              <div>
                <img src={contributor.avatar_url} className="user-avatar-med" />
                <strong>{contributor.login}</strong>
                <p>contributions: {contributor.contributions}</p>
              </div>
            ))}
          </div>
          ))}
      </div>
    )
  }
}
/*

getAllRepoData() {
  var initRepoFetch = () => {
    return fetch(`https://api.github.com/users/${this.props.user.username}/repos?per_page=100`, this.state.options)
      .then((res) => res.json())
      .then(getRepoCommits)
      .catch((err) => console.log('There was an error in initRepoFetch', err));
  };
  var getRepoCommits = (repos) => {
    this.setState({repos: repos});
    for (var i = 0; i < repos.length; i++) {
      var repoName = repos[i].name;
      var newReposContrState = {...this.state.reposContributors}
      fetch(repos[i].contributors_url, this.state.options)
        .then((res) => res.json())
        .then((data) => {this.setState({reposContributors: newReposContrState[repoName] = data})})
        .catch((err) => console.log(err));
    }
  };
  initRepoFetch();
}


{this.state.repos.map((val, i) => {
  console.log('This is the reposContributors and valname in line 66', this.state.reposContributors[`${val.name}`]);
  console.log('This is the reposContributors in line 67', this.state.reposContributors);
  return (
  <div key={i} className="data-result-container">
    <h2>{val.name}</h2>
    <h3>score: {this.state.reposNumCommits[i]}</h3>
    <strong>top contributors</strong>
    {this.state.reposContributors[i] === undefined ? null : this.state.reposContributors[`${val.name}`].map((contributor, i) => {
      if (i < 6) {
        return (
          <div key={i}>
            <img src={contributor.avatar_url} className="user-avatar-med" />
            <h2>{contributor.login}</h2>
            <strong>Number of Contributions</strong>
            <p>{contributor.contributions}</p>
          </div>
      )}}
    )}
  </div>
  )
})}

*/

// {this.renderTopContributors(i)}

// {this.state.reposCommits.map((commits, i) => {
//               console.log('Commit and i', commits, i);
//               return (
//               <div key={i} className="commits">
//                 <strong>{commits[0].commit.author.name}</strong>
//                 <p>{commits[0].commit.message}</p>
//               </div>
//               );
//             })}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repos);
