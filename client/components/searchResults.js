import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';

class SearchResults extends Component {
  render() {
    console.log(this.props);
    if (this.props.searchResults.length !== 0) {
      var searchResults = this.props.searchResults[0].items;
      return (
        <div id="search-results-container">
          {searchResults.map((result) => {
            return (
              <div key={result.id} className="search-result-container">
                <img className="user-avatar-1" src={result.avatar_url} />
                <a href={result.url}>{result.login}</a>
                <p>{result.score}</p>
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