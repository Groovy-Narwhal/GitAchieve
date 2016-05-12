import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import CommitChart from './commitChart';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.state ={
      repos: []
    };
  }
  componentDidUpdate() {
    if (this.props.user.username && !this.state.fetched) {
      this.state = {
        selectedUser: undefined,
        fetched: true,
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
      this.fetchAllRepos();
    }
  }
  fetchRepos() {
    console.log('This is the async username', this.props.user.username);
    return fetch(`https://api.github.com/users/${this.props.chosenSearchResults !== undefined ? this.props.chosenSearchResults.login : this.props.user.username}/repos?per_page=100`, this.state.options)
      .then(res => res.json())
      .then(data => data)
      .catch(err => err);
  }
  fetchAllRepos() {
    async function renderRepos () {
      // awaits the promise from this.fetchRepos to resolve, then assigns repos to that value
      var repos = await this.fetchRepos();
      // Filter data to only include repos that the user has contributed to
      this.setState({repos: repos});
      console.log('These are the repos', this.state.repos);
    };
    renderRepos.call(this);
  }
  fetchRepoData(eTarget, repo) {
    var url = `https://api.github.com/repos/${repo.full_name}/stats/participation`;
    fetch(url, this.state.options)
      .then(res => {
        if (res.status === 202) {
          this.fetchRepoData(null, repo);
          return undefined;
      } else {
        return res.json()
      }})
      .then(data => { CommitChart(data) })
      .catch(err => console.log(err));
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
            <div className="data-result-container" key={i} onClick={ (e) => (this.fetchRepoData(e.target, repoData)) } >
              <h2>{repoData.name}</h2>
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
