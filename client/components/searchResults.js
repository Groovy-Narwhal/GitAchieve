import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { SearchOptions } from './index';
import axios from 'axios';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;


class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  compete(e, result) {
    e.preventDefault();

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

  getResult(result) {
      return (
        <div className="user-result-container text-centered">
          <div className="avatar-container">
            <img className="user-avatar-1" src={result.avatar_url} />
          </div>
          <div className="spacer-2px" />
          <h3 className="font-dark-gray">{result.login.length <= 10 ? result.login : result.login.slice(0, 10) + '...'}</h3>
          <div className="spacer-2px" />
          <input type="button" value="compete" className="button block centered" onClick={(e) => { this.compete(e, result) }} />
          <div className="spacer-2px" />
        </div>
      )

  }

  render() {
    if (this.props.searchResults.length > 0) {
      const searchResults = this.props.searchResults[0].items;
      if (searchResults.length > 0) {
        return (
          <div className="data-results-container-clear">
            <h2 className="font-white">Competitors</h2>
            <div className="data-results-container-flex flex-justify-space-around full-width">
              {searchResults.map((result, index) => {
                return <div key={index}>{this.getResult(result)}</div>
              })}
            </div>
          </div>
        )
      } else {
        return <div></div>
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
