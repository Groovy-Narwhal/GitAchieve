import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';
import utils from '../utils/utils.js';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ''
    }
  }
  componentDidMount() {
    // this.submitHandler = utils.utils.debounce(submitHandler);
  }
  submitHandler(e) {
    e.preventDefault();
    fetch(`https://api.github.com/search/users?q=${this.state.searchInput}`)
      .then((res) => res.json())
      .then((user) => this.props.actions.addCompetitor(user));
  }
  typeSearch(e) {
    this.setState({searchInput: e.target.value});
  }
  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler.bind(this)}>
          <input type="search" placeholder="search repos" onChange={this.typeSearch.bind(this)} />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapDispatchToProps, mapDispatchToProps)(Search);
