import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ScoreBoard from './../containers/ScoreBoard'
import actions from './../actions/actionCreators'

class App extends Component {
  render() {
    return (
      <div>
        <h1>GitAchieve</h1>
        <ScoreBoard dispatch={this.props.dispatch} />
      </div>
    )
  }
}

// return the part of the state that you want to pass down to app
const mapStateToProps = state => {
  return state;
}

// const mapDispatchToProps = dispatch => {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   }
// }

export default connect(mapStateToProps)(App)
