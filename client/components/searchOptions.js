import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../actions/actionCreators';

class SearchOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: ['users', 'repos', 'orgs']
    }
  }

  fetchSearch(name, index) {
    if (name === 'users') {
      fetch(`https://api.github.com/search/users?q=${this.props.searchInput}`)
        .then((res) => res.json())
        .then((users) => {
          this.props.actions.querySearch(users)
        });
    } else if (name === 'repos') {
      fetch(`https://api.github.com/search/repositories?q=${this.props.searchInput}`)
        .then((res) => res.json())
        .then((repos) => this.props.actions.querySearch(repos));
    } else if (name === 'orgs') {
      fetch(`https://api.github.com/search/users?q=${this.props.searchInput}`)
        .then((res) => res.json())
        .then((orgs) => {
          let items = orgs.items.filter(user => user.type === 'Organization');
          orgs.items = items;
          this.props.actions.querySearch(orgs);
        });
    }
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
