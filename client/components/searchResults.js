import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';
import { SearchOptions } from './index';

class SearchResults extends Component {
  compete(e, result) {
    e.preventDefault();
    fetch(`https://api.github.com/users/${result.login}/repos?per_page=100`)
      .then((repos) => repos.json())
      .then((res) => console.log(res));
  }
  routeToUser(e, result) {
    this.props.actions.chooseSearchResult(result);
    fetch(`https://api.github.com/users/${result.login}/events`)
      .then((repos) => repos.json())
      .then((res) => {this.props.actions.searchUserEvents(res)} );
    browserHistory.push(`${result.login}/profile`);
  }

  routeToRepo(e, result) {

  }

  getResult(result) {
    if (!!result.login) {
      return (
        <div className="search-result-container">
          <img className="user-avatar-1" src={result.avatar_url} />
          <h2 onClick={ (e) => { this.routeToUser.call(this, e, result) }}>{result.login}</h2>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
        </div>
      )      
    } else {
      return (
        <div className="search-result-container">
          <h2 onClick={ (e) => { this.routeToRepo.call(this, e, result) }}>{result.full_name}</h2>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
        </div>
      )
    }
  }

  render() {
    if (this.props.searchResults.length !== 0) {
      var searchResults = this.props.searchResults[0].items;
      return (
        <div>
          <SearchOptions />
          <div id="search-results-container">
            {searchResults.map((result, index) => {
              return <div key={result.id}>{this.getResult(result)}</div>
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
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