import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import { cumulativeChart } from './index';

class DashBoard extends Component {

  componentDidMount() {
  }

  render() {
    var achievements = [
    {title:'won a competition', img_url: '/static/assets/trophies/trophy-1-1.png'}, 
    {title:'3 game winning streak', img_url: '/static/assets/trophies/trophy-2-1.png'}, 
    {title:'100 commits', img_url: '/static/assets/trophies/trophy-3-1.png'}, 
    {title:'200 commits', img_url: '/static/assets/trophies/trophy-4-1.png'},
    {title:'300 commits', img_url: '/static/assets/trophies/trophy-5-1.png'},
    {title:'400 commits', img_url: '/static/assets/trophies/trophy-6-1.png'},
    {title:'500 commits', img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'500 commits', img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'500 commits', img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'600 commits', img_url: '/static/assets/trophies/trophy-8-1.png'}
    ]
    return (
      <div className="data-results-container-clear">
        <h2 className="font-white">Achievements</h2>
        <div className="data-results-container-flex full-width">
          {achievements.map((achievement) => (
            <div className="data-result-container text-centered competitor-card">
              <h3>{achievement.title}</h3>
              <img src={achievement.img_url} />
            </div>))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
