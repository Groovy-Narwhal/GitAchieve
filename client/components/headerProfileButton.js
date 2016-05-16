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

  /* Only have the click events enabled when the menu is open */
  componentDidUpdate(prevProps, prevState) {
    if(this.props.open && !prevProps.open) {
      console.log('previous open: ', prevProps.open, 'current open: ', this.props.open)
      window.addEventListener('click', this.handleClickOutside.bind(this));
    } else if(!this.props.open && prevProps.open) {
      window.removeEventListener('click', this.handleClickOutside.bind(this));
    }
  }

  /* If clicked element is not in the dropdown menu children, close menu */
  handleClickOutside(e) {
    var children = ReactDOM.findDOMNode(this).getElementsByTagName('*');
    for(var x in children) {
      if(children[x] === e.target) { return; }
    }
    this.props.close(e);
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
      <div>
        <div className="header-user-button float-right" onClick={this.toggle.bind(this)}>
          <img className="user-avatar-sm" src={this.props.user.avatar_url} />
          <img className="drop-arrow" src={'static/assets/dropArrow.png'} />
          {this.state.open ? <HeaderProfileDropdown open={this.state.open} /> : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(HeaderUserButton);
