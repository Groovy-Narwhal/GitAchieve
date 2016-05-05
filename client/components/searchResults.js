import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';

class SearchResults extends Component {
  compete(e, result) {
    e.preventDefault();
    fetch(`https://api.github.com/users/${result.login}/repos?per_page=100`)
      .then((repos) => repos.json())
      .then((res) => console.log(res));
  }
  render() {
    if (this.props.searchResults.length !== 0) {
      var searchResults = this.props.searchResults[0].items;
      return (
        <div id="search-results-container">
          {searchResults.map((result) => {
            return (
              <div key={result.id} className="search-result-container">
                <img className="user-avatar-1" src={result.avatar_url} />
                <h2 onClick={(e) => ( browserHistory.push(`${result.login}/profile`) )}>{result.login}</h2>
                <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
              </div>
            )
          })}
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