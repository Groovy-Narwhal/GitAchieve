import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ScoreBoard from './../containers/ScoreBoard'
import actions from './../actions/actionCreators'

class App extends Component {
  render() {
    const {
      actions
    } = this.props;
    return (
      <div>
        <h1>GitAchieve</h1>
        <ScoreBoard addToken={actions.addToken} />
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
