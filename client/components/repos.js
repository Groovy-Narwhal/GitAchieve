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
    // Initiates fetching of all repo data for the user
    this.fetchAllRepoData.call(this)
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
  fetchAllRepoData() {
    async function renderRepos () {
      var repos = await this.fetchRepos();
      var contributors = [];
      for (var i = 0; i < repos.length; i++) {
        contributors.push(await this.fetchContributors(repos[i]));
      }
      var incrementor = 0;
      var reposAndContributors = repos.map((repo) => ({repo: repo, contributors: contributors[incrementor++]}))
      this.setState({repos: reposAndContributors});
    };
    renderRepos.call(this);
  }
  render() {
    if (this.state.repos.length === 0) {
      var loadingMessages = ['Baking cupcakes...', 'Riding a narwhal...', 'Getting your groove on...'];
      return (
        <div>
          <h2>{loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}</h2>
          <img src="../static/assets/loading.gif" />
        </div>
      );
    } else {
      return (
        <div id="data-results-container">
          <h3>Repos</h3>
          {this.state.repos.map((repoData, i) => (
            <div className="data-result-container" key={i} >
              <h2>{repoData.repo.name}</h2>
              {repoData.contributors.map((contributor, i) => (
                <div key={i}>
                  <img src={contributor.avatar_url} className="user-avatar-med" />
                  <strong>{contributor.login}</strong>
                  <p>contributions: {contributor.contributions}</p>
                </div>
              ))}
            </div>
            ))}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repos);
