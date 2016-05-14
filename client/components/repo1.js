import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class Repo1 extends Component {
  constructor(props) {
    super(props)
    // this.state.selected ? this.setState({style: 'data-result-container repo-white'}) : this.setState({style: 'data-result-container repo-green'});
    this.state = {
      selected: this.props.selected,
      prevSelected: this.props.selected,
      style: ''
    }
  }
  componentDidUpdate() {
    // if (this.state.selected !== this.props.selected) {
    //   this.setState({style: `${this.state.selected ? 'data-result-container repo-green' : 'data-result-container repo-white' }`});
    // }
  }
  componentDidMount() {
    this.setState({style: `${this.state.selected ? 'data-result-container repo-green' : 'data-result-container repo-white' }`});
  }
  render() {
    return (
      <div className={this.state.style}>
        <h2>{this.props.repoData.name}</h2>
      </div>
    );
  }
}
// onClick={ (e) => (this.selectRepo(e, this.props.repoData, this.props.index))
const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Repo1);
