import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from './index';
import actions from './../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

class Request extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.req.primary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username
        })
      });
  }

  handleAccept(e, req) {
    e.preventDefault();
    const dummySecondaryUsername = 'ashley-austincoder';
    const socket = io.connect(window.location.origin);
    socket.emit('Accept Request', {
      user1: this.props.user.username,
      user2: dummySecondaryUsername
    });


    const secondaryId = req.secondary_user_id;
    const primaryUserId = req.primary_user_id;
    axios.patch(`${ROOT_URL}/api/v1/users/${secondaryId}/friends`, {
      secondaryRepoId: 57168943, //DUMMY DATA
      primaryUserId: primaryUserId
    })
    .then(response => {
      axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/receivedmatches`)
        .then(response => {
          this.props.actions.receivedFriendRequests(response.data);
        });
    })
  }

  render() {
    return <div>
      { !!this.state.avatar ? 
          <div>
            <img className="user-avatar-sm" src={this.state.avatar} />
            <span>You have a compete request from {this.state.username}</span>
            <input onClick={(e) => {this.handleAccept(e, this.props.req)}} type="button" value="Accept" />
          </div> : <div></div> }
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Request);