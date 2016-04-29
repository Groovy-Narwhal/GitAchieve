import React, { Component } from 'react'
import actions from './../actions/actionCreators'

class ScoreBoard extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      inputText: ''
    }
  }

  handleChange(event) {
    this.setState({
      inputText: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('HELLO', actions.addToken);
    this.props.dispatch(actions.addToken())
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="enter a token"
          value={this.state.inputText}
          onChange={this.handleChange.bind(this)}
        />
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    )
  }
}

export default ScoreBoard



// <form onSubmit={e => {
//   e.preventDefault()
//   if (!input.value.trim()) {
//     return
//   }
//   dispatch(incrementScore(parseInt(input.value)))
//   input.value = ''
// }}>
//   <input ref={node => {
//     input = node
//   }} />
//   <button type="submit">
//     Increment Score
//   </button>
// </form>