import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Repo1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      style: 'data-result-container repo-white'
    }
  }
  selectRepo(e, repoData) {
    this.state.selected ? this.setState({style: 'data-result-container repo-white'}) : this.setState({style: 'data-result-container repo-green'});
  }
  render() {
    return (
      <div className={this.state.color} onClick={ (e) => (this.selectRepo(e, this.props.repoData)) } >
        <h2>{this.props.repoData.name}</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Repo1);
