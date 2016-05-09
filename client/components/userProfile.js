import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class UserProfile extends Component {
  
  componentWillUnmount() {
    this.props.actions.searchUserEvents([]);
  }

  eventTypeFilter(event) {
    switch (event.type) {
      case 'PushEvent':
        return (
          <div className="event-commits">
            <strong>{event.payload.commits.length} commits</strong>
            {event.payload.commits.map((commit, index) => (
              <div key={index}>
                <p>author: {commit.author.name}</p>
                <p>commit message: {commit.message}</p>
              </div>
            ))}
          </div>
          );
      case 'PullRequestEvent':
        return (
          <div>
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

  render() {
    return (
      <div>
        <img src={this.props.chosenSearchResult.avatar_url} className="user-avatar-1" />
        <h2>{this.props.chosenSearchResult.login}</h2>
        <div id="search-results-container">
          {this.props.searchUserEvents.map((event, index) => {
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
          })}
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