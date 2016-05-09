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
      reposNumCommits: [],
      totalCommits: 0
    }
    // this.getAllReposCommits();
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
        .catch((err) => console.log(err));      
    };
    var getRepoCommits = (repos) => {
      this.setState({repos: repos});
      var numCommits = 0;
      // for (var i = 0; i < repos.length; i++) {
      //   let url = repos[i].commits_url.slice(0, repos[i].commits_url.indexOf('{'));
      //   fetch(url, options)
      //     .then((res) => res.json())
      //     .then((data) => this.setState({reposCommits: [...this.state.reposCommits, data]}));
      //   numCommits += 1;
      //   this.state.commits += 1;
      // }
      console.log('These are the repos', repos);
      // console.log(this.state.reposNumCommits);
      this.setState({reposNumCommits: [...this.state.reposNumCommits, numCommits]});
    };
    initRepoFetch();
  }
  render() {
    return (
      <div id="data-results-container">
        <h3>Repos</h3>
        {this.state.repos.map((val, i)=> {
          console.log('val and i', val, i);
          console.log('Number of repo commits', this.state.reposNumCommits)
          return (
          <div key={i} className="data-result-container">
            <h2>{val.name}</h2>
            <h3>score: {this.state.reposNumCommits[i]}</h3>
          </div>
          )
        })}
      </div>
    )
  }
  
}

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
