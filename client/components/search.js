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
    this.props.actions.inputSearch(this.state.searchInput);
    fetch(`https://api.github.com/search/users?q=${this.state.searchInput}`)
      .then((res) => res.json())
      .then((users) => this.props.actions.querySearch(users));
  }
  typeSearch(e) {
    this.setState({searchInput: e.target.value});
  }
  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler.bind(this)}>
          <select>
            <option value="repos">repos</option>
            <option value="users">users</option>
          </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
