import React, { Component } from 'react';
import * as actions from './../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SearchOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeLink: 1,
      tabs: ['users', 'repos', 'orgs']
    }
  }

  fetchSearch(name, index) {
    console.log(this.state);
  }

  render() {
    return (
      <nav>
        <ul>
          {this.state.tabs.map((name, index) => (
            <li key={index} onClick={this.fetchSearch.bind(this, name, index)}>{name}</li>
          ))}
        </ul>
      </nav>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(actions, dispatch)
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
