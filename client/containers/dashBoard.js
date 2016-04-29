import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';

class DashBoard extends Component {
  render() {
    const {
      actions
    } = this.props;
    return (
      <div>
        <h1>Dash Board</h1>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
