import React from 'react'
import { connect } from 'react-redux'
import { incrementScore } from '../actions/actionCreators'

let showScore = ({dispatch, onClick}) => {
  function handleClick() {
    console.log('Hello from showScore');
  }
  return (
    <div>
      <button onClick={handleClick}>Click Here</button>
      <div>Hey</div>
    </div>
  )
}

showScore = connect()(showScore)

export default showScore