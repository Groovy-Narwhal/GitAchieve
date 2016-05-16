import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
  }
  componentWillUnmount() {
    this.props.actions.searchUserEvents([]);
  }
  componentWillMount() {
    this.getCompetitors();
  }
  getCompetitors() {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${this.props.user.id}/friends`)
      .then(data => this.setState({friends: data.data}))
  }

  render() {
    return (
      <div className="data-results-container">
        <img src={this.props.user.avatar_url} className="user-avatar-1" />
        <h2 className="font-white">{this.props.user.username}</h2>
        <div>
          <h2>Friends</h2>
          {this.state.friends.length !== 0 ? this.state.friends.map(friend => (<div key={friend.id}><p>{friend.username}</p></div>)) : <div></div>}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);