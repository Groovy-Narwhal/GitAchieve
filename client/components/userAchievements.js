import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { cumulativeChart } from './index';

class DashBoard extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="achievements">
        <div>Achievements</div>
        <img src="../static/assets/medal.svg" alt="medal image" height="50px" width="50px" />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
