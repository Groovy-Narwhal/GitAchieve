import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from './index';
import actions from './../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

class ReceivedCompetitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.primary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username
        })
      });
  }

  handleAccept(e, req) {
    console.log(this.props.c)
    e.preventDefault();
    const socket = io.connect(window.location.origin);
    socket.emit('Accept Request', {
      user1: this.props.user.username,
      user2: this.state.username
    });

    axios.patch(`${ROOT_URL}/api/v1/users/${this.props.user.id}/friends`, {
      secondaryRepoId: 57168943, //DUMMY DATA
      primaryUserId: this.props.c.primary_user_id
    })
    .then(response => {
      console.log('RES', response)
      axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/receivedmatches`)
        .then(response => {
          this.props.actions.receivedFriendRequests(response.data);
        });
    })
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.primary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username
        })
      })
  }

  render() {
    return <div>
      { !!this.state.avatar ? 
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h2 className="font-white">{this.state.username}</h2>
            <span>Incoming Request!</span>
            <input onClick={(e) => {this.handleAccept(e, this.props.req)}} type="button" value="Accept" />
          </div> : <div></div> }
    </div>
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceivedCompetitorCard);






