import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import Repos from './repos';
import axios from 'axios';

const ROOT_URL = require('../../server/config/config-settings').CALLBACKHOST;

class ChooseSecondWeapon extends Component {

  compete() {
    browserHistory.push('/');
    const secondaryId = this.props.params.userid;
    this.props.actions.addCompetitor({competitor: this.props.chosenSearchResult, myWeapon: this.props.chosenWeapons});
    const secondaryRepoId = this.props.chosenWeapons.id;
    this.props.actions.chooseSearchResult({});
    this.props.actions.chooseWeapon({});

    axios.get(`${ROOT_URL}/api/v1/users/${secondaryId}`)
      .then((response) => {
        
        const socket = io.connect(window.location.origin);
        socket.emit('Accept Request', {
          user1: this.props.user.username,
          user2: response.data.username
        });
        axios.patch(`${ROOT_URL}/api/v1/users/${this.props.user.id}/friends`, {
          secondaryRepoId: secondaryRepoId,
          primaryUserId: secondaryId
        })
        .then(response => {
          axios.get(`${ROOT_URL}/api/v1/users/${this.props.user.id}/successmatches`)
            .then(response => {
              this.props.actions.confirmedFriendRequests(response.data);
            });
        })
      })
  }
  
  render() {
    return (
      <div className="data-results-container-clear">
        <h2>Choose Your Weapon // Repos</h2>
        <Repos />
        <div className="spacer-10px"></div>
        <div className="block text-centered">
          <input type="submit" value="COMPETE" className="button compete" onClick={this.compete.bind(this)} />
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSecondWeapon);
