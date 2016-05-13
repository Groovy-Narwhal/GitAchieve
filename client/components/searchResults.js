import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { SearchOptions } from './index';

class SearchResults extends Component {

  compete(e, result) {
    e.preventDefault();

    // HARDCODE DATA IN REDUX STORE FOR CHART (TEMPORARY)
    this.props.actions.addCompetitorData([20, 11]);
    this.props.actions.addDailyCompetitorData([[5, 4, 2, 7, 3, 6, 8], [2, 3, 5, 9, 7, 2, 3]]);
    // END HARDCODE
    this.props.actions.chooseSearchResult(result);
    browserHistory.push(`compete/choose-repo/${result.login}`);
  }

  routeTo(e, result, type) {
    this.props.actions.chooseSearchResult(result);
    let fetchTo, routeTo;
    if (type === 'user') {
      fetchTo = `https://api.github.com/users/${result.login}/events`;
      routeTo = `${result.login}/profile`;
    }
    if (type === 'org') {
      fetchTo = `https://api.github.com/orgs/${result.login}`;
      routeTo = `${result.login}/orgs`;
    }
    if (type === 'repo') {
      fetchTo = `https://api.github.com/repos/${result.owner.login}/${result.name}`;
      routeTo = `${result.name}/repos`;
    }
    fetch(fetchTo)
      .then((res) => res.json())
      .then((res) => {
        if (type === 'user') {
          this.props.actions.searchUserEvents(res);
        }
      });
    browserHistory.push(routeTo);
  }
  navToUserRepo(e, userData) {
    browserHistory.push(`${userData.login}/repos`)
    this.props.actions.chooseSearchResult(userData);
  }
  getResult(result) {
    if (result.type === 'User') {
      return (
        <div className="user-result-container">
          <img className="user-avatar-1" src={result.avatar_url} />
          <h2 onClick={ (e) => { this.routeTo.call(this, e, result, 'user') }}>{result.login}</h2>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
          <input type="button" value="repos" onClick={(e) => { this.navToUserRepo(e, result) }} />
        </div>
      )
    } else if (result.type === 'Organization') {
      return (
        <div className="user-result-container">
          <img className="user-avatar-1" src={result.avatar_url} />
          <h2 onClick={ (e) => { this.routeTo.call(this, e, result, 'org') }}>{result.login}</h2>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
        </div>
        )
    } else {
      return (
        <div className="user-result-container">
          <h2 onClick={ (e) => { this.routeTo.call(this, e, result, 'repo') }}>{result.full_name}</h2>
          <p>Description: {result.description}</p>
          <p>Stargazers: {result.watchers}</p>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
        </div>
      )
    }
  }

  render() {
    if (this.props.searchResults.length > 0) {
      const searchResults = this.props.searchResults[0].items;
      if (searchResults.length > 0) {
        return (
          <div>
            <div className="data-results-container-flex">
              {searchResults.map((result, index) => {
                return <div key={index}>{this.getResult(result)}</div>
              })}
            </div>
          </div>
        )
      } else {
        return <SearchOptions />
      }
    } else {
      return <div></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);