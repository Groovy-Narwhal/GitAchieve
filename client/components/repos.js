import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import Repo1 from './repo1';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetched: false,
      repos: [],
      reposObj: {},
      selectedRepo: undefined,
      repoClicked: [],
      options: {}
    };
  }
  fetchRepos() {
    if (this.props.chosenSearchResult.login !== undefined && !window.location.pathname.includes('compete')) {
      var url = this.props.chosenSearchResult.login;
    } else { 
      var url = this.props.user.username;
    }
    return fetch(`https://api.github.com/users/${url}/repos?per_page=100`, this.state.options)
      .then(res => res.json())
      .then(data => data)
      .catch(err => err);
  }
  fetchAllRepos() {
    async function renderRepos () {
      // awaits the promise from this.fetchRepos to resolve, then assigns repos to that value
      var repos = await this.fetchRepos();
      var selectableRepos = repos.map(repo => ({value: repo , label: repo.name}))
      // Create reposObject for constant time lookup
      var reposObj = {}
      repos.forEach((repo) => {reposObj[repo.name] = repo})
      this.setState({reposObj: reposObj});
      // Filter data to only include repos that the user has contributed to
      this.setState({repos: repos});

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

      this.setState({repoClicked: this.state.repos.map(repo => false)});
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
  selectRepo(e) {
    this.setState({selectedRepo: this.state.reposObj[e.target.value]});
  }
  log(e) {
    console.log('logging: ', e.target.value);
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
            <select onChange={(e) => (this.selectRepo.call(this, e))}>
              {this.state.repos.map(repo => (<option>{repo.name}</option>))}
            </select>
          </div>
        );
      } else {
        return (
          <div className="data-results-container-flex full-width">
            {this.state.repos.map((repoData, i) => (
              <div className="data-result-container" key={repoData.id} onClick={ (e) => (this.fetchRepoData(e.target, repoData)) } >
                <h2>{repoData.name}</h2>
              </div>
              ))}
          </div>
        );
      }
    }
  }
}

// {this.state.repos.map((repoData, i) => (
//   <div onClick={this.selectRepo.bind(this, i)}>
//     <Repo1 repoData={repoData} key={repoData.id} index={i} selected={this.state.repoClicked[i]} />
//   </div>
//   ))}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repos);
