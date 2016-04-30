import React, { Component } from 'react';

const ScoreBoard = ({ score }) => (
  <div>Score: {score} </div>
)

export default ScoreBoard;


// class ScoreBoard extends Component {
//   constructor(props, context) {
//     super(props, context)
//     this.state = {
//       inputText: ''
//     }
//   }

//   handleChange(event) {
//     this.setState({
//       inputText: event.target.value
//     })
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     this.props.addToken(this.state.inputText);
//   }

//   render() {
//     return (
//       <div>
//         <input
//           type="text"
//           placeholder="enter a token"
//           value={this.state.inputText}
//           onChange={this.handleChange.bind(this)}
//         />
//         <button onClick={this.handleSubmit.bind(this)}>Submit</button>
//       </div>
//     )
//   }
// };
