import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import CommitChart from './commitChart';
import Repo1 from './repo1';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetched: false,
      repos: [],
      options: {}
    };
  }
  fetchRepos() {
    return fetch(`https://api.github.com/users/${this.props.chosenSearchResult.login !== undefined ? this.props.chosenSearchResult.login : this.props.user.username}/repos?per_page=100`, this.state.options)
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
      this.props.actions.chooseSearchResult({});

      var pad = 30;
      var w = 540;
      var h = 300;
      d3.select('svg')
        .append('text')
        .text('select a repo!')
        .attr('x', w/2)
        .attr('y', h/2)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px');

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
      .then(data => { return; })
      .catch(err => console.log(err));
  }
  setStateFetchInit() {
    if (this.props.user.username && !this.state.fetched) {
      this.setState({
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
      });
      // Initiates fetching of all repo data for the user
      this.fetchAllRepos();
    } else {
      // setTimeout is necessary to check if the this.props.user.username is updated and defined
      // initially, this.props.user.username upon load is undefined, therefore we need to keep checking if it's loaded
      // putting the if block code in the render method will give you a warning that setState should not be in the render method
      // putting the ifblock code in the componentDidUpdate will give you an infinite loop, or not work for different cases of looking up repos
      setTimeout(this.setStateFetchInit.bind(this), 250);
    }
  }
  selectRepo(e, repoData) {
    console.log('In compete', e.target);
    console.log(e);
  }
  componentDidMount() {
    this.setStateFetchInit();
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
      if (window.location.pathname.includes('compete')) {
        return (
          <div className="data-results-container-flex full-width">
            {this.state.repos.map((repoData, i) => (
              <Repo1 repoData={repoData} key={i} />
              ))}
          </div>
        );
      } else {
        return (
          <div className="data-results-container-flex full-width">
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
