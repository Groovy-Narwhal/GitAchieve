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
    {title:'won a competition', wins: 1, img_url: '/static/assets/trophies/trophy-1-1.png'}, 
    {title:'3 game winning streak', streak: 3, img_url: '/static/assets/trophies/trophy-2-1.png'}, 
    {title:'25 contributions', contributions: 25, img_url: '/static/assets/trophies/trophy-3-1.png'}, 
    {title:'50 contributions', contributions: 50, img_url: '/static/assets/trophies/trophy-4-1.png'},
    {title:'100 contributions', contributions: 100, img_url: '/static/assets/trophies/trophy-5-1.png'},
    {title:'200 contributions', contributions: 200, img_url: '/static/assets/trophies/trophy-6-1.png'},
    {title:'300 contributions', contributions: 300, img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'400 contributions', contributions: 400, img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'500 contributions', contributions: 500, img_url: '/static/assets/trophies/trophy-7-1.png'},
    {title:'600 contributions', contributions: 600, img_url: '/static/assets/trophies/trophy-8-1.png'}
    ]
    var userAchievements = achievements.filter((achievement) => (achievement.contributions && parseInt(this.props.userContributions[0]) > achievement.contributions));
    return (
      <div className="data-results-container-clear">
        <h2 className="font-white">Achievements</h2>
        <div className="data-results-container-flex full-width">
          {userAchievements.map((achievement) => (
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
