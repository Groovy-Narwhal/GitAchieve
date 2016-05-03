import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { Link, browserHistory } from 'react-router';
import Header from './header';
// import actions from './../actions/actionCreators';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

// const mapStateToProps = state => {
//   return state;
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);





// <div>
//   <header>
//     <div>Welcome, msmith9393!</div>
//     <ScoreBoard score={this.props.score} />
//     <div>
//       Links:
//       {' '}
//       <Link to="/">Home</Link>
//       {' '}
//       <Link to="/repos">Repos</Link>
//       {' '}
//       <Link to="/repos">Orgs</Link>
//       {' '}
//       <Link to="/logout">Logout</Link>
//       {' '}
//       <Link to="/login">Login</Link>
//     </div>
//   </header>
//   <div>{this.props.children}</div>
// </div>
