import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class OrgProfile extends Component {

  render() {
    const { chosenSearchResult } = this.props;
    return (
      <div>
        <img src={chosenSearchResult.avatar_url} className="user-avatar-1"/>
        <h2>{chosenSearchResult.login}</h2>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(OrgProfile);
