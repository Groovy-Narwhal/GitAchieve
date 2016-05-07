import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './../actions/ActionCreators';

class HeaderUserButton extends Component {
  constructor(props) {
    super(props)
  }

  /* Only have the click events enabled when the menu is open */
  // componentDidUpdate(prevProps, prevState) {
  //   if(this.props.open && !prevProps.open) {
  //     console.log('previous open: ', prevProps.open, 'current open: ', this.props.open)
  //     window.addEventListener('click', this.handleClickOutside.bind(this));
  //   } else if(!this.props.open && prevProps.open) {
  //     window.removeEventListener('click', this.handleClickOutside.bind(this));
  //   }
  // }

  /* If clicked element is not in the dropdown menu children, close menu */
  handleClickOutside(e) {
    var children = ReactDOM.findDOMNode(this).getElementsByTagName('*');
    for(var x in children) {
      if(children[x] === e.target) { return; }
    }
    this.props.forceCloseFunction(e);
  }

  render() {
    return (
      <div className="header-profile-dropdown">
        <ul>
        <li>profile</li>
        <li>achievements</li>
        <li>signout</li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(HeaderUserButton);
