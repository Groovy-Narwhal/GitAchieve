import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Repos extends Component {
  constructor(props) {
    super(props)
    this.getAllRepoData();
    this.state = {
      repos: [],
      reposCommits: [],
      reposContributors: [],
      reposNumCommits: [],
      totalCommits: 0
    }
  }
  getAllRepoData() {
    var options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.props.user.username,
        'Authorization': `token ${localStorage.token}`
      }
    };
    var initRepoFetch = () => {
      return fetch(`https://api.github.com/users/${this.props.user.username}/repos?per_page=100`, options)
        .then((res) => res.json())
        .then(getRepoCommits)
        .catch((err) => console.log('There was an error in initRepoFetch', err));
    };
    var getRepoCommits = (repos) => {
      this.setState({repos: repos});
      for (var i = 0; i < repos.length; i++) {
        fetch(repos[i].contributors_url, options)
          .then((res) => res.json())
          .then((data) => this.setState({reposContributors: [...this.state.reposContributors, data]}))
          .catch((err) => console.log(err));
      }
    };
    initRepoFetch();
  }
  renderTopContributors(i) {
    console.log('Were inside of the renderTopContributors, ', i, this.state.reposContributors[i]);
    console.log('And here are the reposContributors: ', this.state.reposContributors);
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
  render() {
    return (
      <div id="data-results-container">
        <h3>Repos</h3>
        {this.state.repos.map((val, i) => {
          console.log(this.state.reposContributors[i]);
          return (
          <div key={i} className="data-result-container">
            <h2>{val.name}</h2>
            <h3>score: {this.state.reposNumCommits[i]}</h3>
            <strong>top contributors</strong>
            {this.state.reposContributors[i] === undefined ? null : this.state.reposContributors[i].map((contributor, i) => {
              if (i < 6) {
                return (
                <div key={i}>
                  <h2>{contributor.login}</h2>
                  <strong>Number of Contributions</strong>
                  <p>{contributor.contributions}</p>
                </div>
              )}}
            )}
          </div>
          )
        })}
      </div>
    )
  }
}
/*


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
