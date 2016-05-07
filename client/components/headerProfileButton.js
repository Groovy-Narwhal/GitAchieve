import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';
import HeaderProfileDropdown from './headerProfileDropdown';

class HeaderUserButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    console.log('Initial open state: ', this.state.open);
  }

  toggle() {
    this.setState({open: !this.state.open})
    console.log(this.state.open);
  }

  close(id) {
    this.setState({open: false});
    console.log(this.state.open);
  }

  render() {
    return (
      <div className="header-user-button float-right">
        <img className="user-avatar-sm" onClick={this.toggle.bind(this)} src={this.props.user.avatar_url} />
        {this.state.open ? <HeaderProfileDropdown open={this.state.open} forceCloseFunction={this.close.bind(this)} /> : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(HeaderUserButton);
