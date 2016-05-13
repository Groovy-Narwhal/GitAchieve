import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from './index';
import * as actions from './../actions/index';
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

  handleAccept(req) {
    // search for user in users_users table they will be the secondary user id switch confirmed at flag to true.
    const secondaryId = this.props.user.id;
    const primaryUserId = req.primary_user_id;

  }

  render() {
    return <div>
      { !!this.state.avatar ? 
          <div>
            <img className="user-avatar-sm" src={this.state.avatar} />
            <span>You have a compete request from {this.state.username}</span>
            <button onClick={this.handleAccept.bind(this, this.props.req)}>Accept</button>
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
||||||| merged common ancestors
=======
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from './index';
import * as actions from './../actions/index';
import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8000';

class Request extends Component {
  
  handleAccept(req) {
    // search for user in users_users table they will be the secondary user id switch confirmed at flag to true.
    const secondaryId = this.props.user.id;
    // axios.patch(`${ROOT_URL}/api/v1/users/${secondaryId}/friends`, {
    //   primaryUserId: req.primary_user_id
    // })
  }

  render() {
    return (
      <div>
        <p>You have a compete request</p>
        <button onClick={this.handleAccept.bind(this, this.props.req)}>Accept</button>
      </div>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Request);
>>>>>>> (feat) Add request
