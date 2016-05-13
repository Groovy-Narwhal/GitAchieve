import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from './index';
import * as actions from './../actions/index';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

class SentRequest extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.req.secondary_user_id}`)
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
            <img className="user-avatar-sm" src={this.state.avatar} />
            <span>Waiting for response from {this.state.username}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(SentRequest);