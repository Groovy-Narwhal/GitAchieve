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
    {title:'3 game winning streak', img_url: '/static/assets/trophies/trophy-1-1.png'}, 
    {title:'100 commits', img_url: '/static/assets/trophies/trophy-2-1.png'}, 
    {title:'200 commits', img_url: '/static/assets/trophies/trophy-2-1.png'}
    ]
    return (
      <div className="data-results-container">
        <div>Achievements</div>
        {achievements.map((achievement) => (<div><h3>{achievement.title}</h3><img src={achievement.img_url} /></div>))}
        <img src="../static/assets/medal.svg" alt="medal image" height="50px" width="50px" />
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
