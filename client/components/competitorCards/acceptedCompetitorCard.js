import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Header } from './../index';
import actions from './../../actions/ActionCreators';
import axios from 'axios';

const ROOT_URL = require('../../../server/config/config-settings').CALLBACKHOST;

class AcceptedCompetitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      username: ''
    }
  }

  componentWillMount() {
    axios.get(`${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}`)
      .then(response => {
        this.setState({
          avatar: response.data.avatar_url,
          username: response.data.username,
          userid: response.data.id
        })
      });
  }

  handleAccept(e, c) {
    // get user's data

    console.log('primaryID, secondaryID, primaryREPO, secondaryREPO, competitionSTART:',
      c.primary_user_id, c.secondary_user_id, c.primary_repo_id, c.secondary_repo_id, c.competition_start);

    var user_url = `${ROOT_URL}/api/v1/users/${this.props.c.primary_user_id}/commits/start`;
    console.log('user url:', user_url);

    axios({
      method: 'get',
      url: user_url,
      headers: {
        startdate: c.competition_start,
        repoid: c.primary_repo_id
      },
    })
      .then(response => {
        console.log('response from user axios:', response);

        // get second set of data
        var comp_url = `${ROOT_URL}/api/v1/users/${this.props.c.secondary_user_id}/commits/start`;
        console.log('comp url:', comp_url);
        axios({
          method: 'get',
          url: comp_url,
          headers: {
            startdate: c.competition_start,
            repoid: c.secondary_repo_id
          },
        })
          .then(response => {
            console.log('response from competitor axios:', response);

            // change Redux store - which should re-render graph data automagically
            // (WAIT! it shouldn't because Tab 1)
            // this.props.actions.addCompetitorData([20, 11]);
            // this.props.actions.addDailyCompetitorData([[5, 4, 2, 7, 3, 6, 8], [2, 3, 5, 9, 7, 2, 3]]);
          });
      });
  }

  render() {
    return <div>
      { !!this.state.avatar ?
          <div>
            <img className="user-avatar-med" src={this.state.avatar} />
            <h2 className="font-white">{this.state.username}</h2>
            <span>Confirmed Request!</span>
            <input onClick={(e) => {this.handleAccept(e, this.props.c)}} type="button" value="COMPETE!" />
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedCompetitorCard);
