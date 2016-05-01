import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router'
import ScoreBoard from './../containers/scoreBoard';
import actions from './../actions/actionCreators';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <header>
          Links WOO:
          {' '}
          <Link to="/">Home</Link>
          {' '}
          <Link to="/v1/users">Users</Link>
        </header>
        <div>
          <button onClick={() => browserHistory.push('/v1/users')}>Go to /v1/users</button>
        </div>
        <ScoreBoard addToken={this.props.actions.addToken} />
        <div style={{ marginTop: '1.5em' }}>{this.props.children}</div>
      </div>
    )
  }
}

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import ScoreBoard from './../containers/ScoreBoard';

// class App extends Component {
//   render() {
//     const {
//       actions
//     } = this.props;
//     return (
//       <div>
//         <h1>GitAchieve</h1>
//         <ScoreBoard addToken={actions.addToken} />
//       </div>
//     )
//   }
// }

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
