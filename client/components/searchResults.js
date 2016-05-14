import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { SearchOptions } from './index';


class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  compete(e, result) {
    e.preventDefault();

    // HARDCODE DATA IN REDUX STORE FOR CHART (TEMPORARY)
    this.props.actions.addCompetitorData([20, 11]);
    this.props.actions.addDailyCompetitorData([[5, 4, 2, 7, 3, 6, 8], [2, 3, 5, 9, 7, 2, 3]]);
    // END HARDCODE
    this.props.actions.chooseSearchResult(result);
    browserHistory.push(`compete/choose-repo/${result.login}`);

  }

  getResult(result) {
      return (
        <div className="user-result-container">
          <img className="user-avatar-1" src={result.avatar_url} />
          <h2>{result.login}</h2>
          <input type="button" value="compete" onClick={(e) => { this.compete(e, result) }} />
        </div>
      )
    
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
        return <div></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);