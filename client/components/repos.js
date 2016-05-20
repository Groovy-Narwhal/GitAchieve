import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class Repos extends Component {

  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      reposObj: {},
      selectedRepo: undefined,
      repoClicked: []
    };
  }

  fetchRepos() {
    return axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/repos`)
      .then(res => {
        this.setState({repos: res.data})
        if (res.data[0]) {
          this.props.actions.chooseWeapon(res.data[0]);
        }
      })
      .catch(err => err);
  }

  fetchAllRepos() {
    async function renderRepos() {
      // awaits the promise from this.fetchRepos to resolve, then assigns repos to that value
      await this.fetchRepos();
      var selectableRepos = this.state.repos.map(repo => ({value: repo , label: repo.name}))
      // Create reposObject for constant time lookup
      var reposObj = {}
      this.state.repos.forEach((repo) => {reposObj[repo.name] = repo})
      this.setState({reposObj: reposObj});
      this.setState({repoClicked: this.state.repos.map(repo => false)});
    };
    renderRepos.call(this);
  }

  setStateFetchInit() {
    if (this.props.user.username) {
      // Initiates fetching of all repo data for the user
      this.fetchAllRepos();
    }
  }
  selectRepo(e) {
    this.props.actions.chooseWeapon(this.state.reposObj[e.target.value]);
    this.setState({selectedRepo: this.state.reposObj[e.target.value]});
  }

  componentDidMount() {
    this.fetchAllRepos();
  }

  render() {
      return (
        <select onChange={(e) => (this.selectRepo.call(this, e))}>
          <option disabled>select a repo</option>
          {this.state.repos.map(repo => (<option value={repo.name} key={repo.id}>{repo.name}</option>))}
        </select>
      );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repos);