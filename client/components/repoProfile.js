import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';

class RepoProfile extends Component {
  componentWillMount() {
    // axios.get('/repos')
  }

  render() {
    const { chosenSearchResult } = this.props;
    return (
      <div>
        <h3>{chosenSearchResult.full_name}</h3>
        <p>{chosenSearchResult.description}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(RepoProfile);
