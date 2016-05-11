import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUser: undefined,
      repos: [],
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
    this.fetchAllRepoData();
  }
  fetchRepos() {
    return fetch(`https://api.github.com/users/${this.props.chosenSearchResults !== undefined ? this.props.chosenSearchResults.login : this.props.user.username}/repos?per_page=100`, this.state.options)
      .then((res) => res.json());
  }
  fetchContributors(repo) {
    return fetch(`https://api.github.com/repos/${repo.full_name}/stats/contributors`, this.state.options)
      .then((res) => res.json());
  }
  fetchAllRepoData() {
    async function renderRepos () {
      // awaits the promise from this.fetchRepos to resolve, then assigns repos to that value
      var repos = await this.fetchRepos();
      var contributors = [];
      // Get all contributors from each repo
      for (var i = 0; i < repos.length; i++) {
        contributors.push(await this.fetchContributors(repos[i]));
      }
      // Get user contributions for each repo
      var userScoreArr = contributors.map((c) => { 
        let res;
        c.forEach((user) => { if (user.author.login === this.props.user.username) res = user.total; });
        return res;
      });
      // Filter data to only include repos that the user has contributed to
      var reposFiltered = repos.filter((repo, i) => userScoreArr[i] !== undefined);
      var contributorsFiltered = contributors.filter((c, i) => userScoreArr[i] !== undefined);
      var scoreFiltered = userScoreArr.filter((s, i) => userScoreArr[i] !== undefined);
      var reposAndContributors = reposFiltered.map((repo, index) => ({repo: repo, contributors: contributorsFiltered[index], numCommits: scoreFiltered[index]}))
      this.setState({repos: reposAndContributors});
      this.props.actions.chooseSearchResult({});
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
              <strong>your score: {repoData.numCommits}</strong>
              {repoData.contributors.map((contributor, i) => (
                <div key={i}>
                  <img src={contributor.author.avatar_url} className="user-avatar-med" />
                  <strong>{contributor.author.login}</strong>
                  <p>contributions: {contributor.total}</p>
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
