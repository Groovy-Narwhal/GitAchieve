import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import axios from 'axios';
import moment from 'moment';
import classNames from 'classnames';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      userEvents: [],
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.props.user.username,
          'Authorization': `token ${localStorage.token}`
        }
      }
    };
  }
  componentWillUnmount() {
    this.props.actions.searchUserEvents([]);
  }
  componentWillMount() {
    this.getFriends();
    this.fetchEvents.call(this)
  }
  getFriends() {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${this.props.user.id}/friends`, this.state.options)
      .then(data => this.setState({friends: data.data}))
  }
  fetchEvents() {
    if (window.location.pathname.includes(this.props.user.username)) {
      axios.get(`https://api.github.com/users/${this.props.user.username}/events`, this.state.options)
        .then(response => this.setState({userEvents: response.data}))
    } else {
      let slicedName = window.location.pathname.slice(1);
      let username = slicedName.slice(0, slicedName.indexOf('/'))
      axios.get(`https://api.github.com/users/${username}/events`, this.state.options)
        .then(response => this.setState({userEvents: response.data}))
    }
  }
  eventTypeFilter(event) {
     switch (event.type) {
       case 'PushEvent':
         return (
           <div className="data-result-container event-commits">
             <strong>{event.payload.commits.length} commits</strong>
           </div>
           );
       case 'PullRequestEvent':
         return (
           <div className="data-result-container">
             <strong>action: {event.payload.action}</strong>
             <p>number of commits: {event.payload.pull_request.commits}</p>
             <p>number of changed files: {event.payload.pull_request.changed_files}</p>
             <p>number of additions: {event.payload.pull_request.additions}</p>
             <p>number of deletions: {event.payload.pull_request.deletions}</p>
           </div>
         );
       case 'GollumEvent':
         return (<div></div>);
       case 'IssueCommentEvent':
         return (<div></div>);
       case 'DeleteEvent':
         return (<div></div>);
       default:
         return (<div></div>);
     }
   }
   renderEvents() {
      if (this.props.searchUserEvents.length > 0) {
        return this.props.searchUserEvents.map((event, index) => {
          if (event.type === 'PushEvent' || event.type === 'PullRequestEvent') {
            return (
              <div key={index} className="search-result-container" >
                <h3 className="event-title">{event.type}</h3>
                <span className="event-title"> at </span>
                <h3 className="event-title">{event.repo.name}</h3>
                <span>{event.created_at}</span>
                {this.eventTypeFilter(event)}
              </div>
            )
          }
        });
      } else {
        return this.state.userEvents.map((event, index) => {
          if (event.type === 'PushEvent' || event.type === 'PullRequestEvent') {
            return (
              <div key={index} className="search-result-container" >
                <span className={classNames("font-lightest-gray font-weight-light fonts-size-regular")}>{moment(new Date(event.created_at)).fromNow()}</span>
                <h3 className="event-title">{event.type}</h3>
                <span className="event-title"> at </span>
                <h3 className="event-title">{event.repo.name}</h3>
                {this.eventTypeFilter(event)}
              </div>
            )
          }
        });
      }
   }
   renderFriends() {
    if (this.state.friends.length !== 0) {
      return this.state.friends.map(friend => (
        <div key={friend.id}><p><Link to={`/${friend.username}/profile`}>{friend.username}</Link></p></div>
      ))
    }
   }
   render() {
     return (
       <div className="data-results-container">
         <img src={this.props.user.avatar_url} className="user-avatar-1" />
         <h2>{this.props.user.username}</h2>
         <div>
           <h2>Friends</h2>
           {this.renderFriends()}
         </div>
         <div id="search-results-container">
           {this.renderEvents()}
         </div>
       </div>
     )
   }
}
/*
{event.payload.commits.map((commit, index) => (
  <div key={index}>
    <p>author: {commit.author.name}</p>
    <p>commit message: {commit.message}</p>
  </div>
))}
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
*/
const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);