import React, { Component } from 'react';

export default class Search extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <input type="search" placeholder="search repos" />
          <input type="submit" />
        </form>
      </div>
    )
  }
}
