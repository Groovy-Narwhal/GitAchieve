import React from 'react'
import { connect } from 'react-redux'
import { incrementScore } from '../actions/actionCreators'

let UpdateScore = ({ dispatch }) => {
  let input;
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(incrementScore(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Increment Score
        </button>
      </form>
    </div>
  )
}

UpdateScore = connect()(UpdateScore)

export default UpdateScore



// import React from 'react'
// import { connect } from 'react-redux'


// let showScore = (props) => {
//   console.log('Props', props)
//   function handleClick() {
//     // store.dispatch(incrementScore(1));
//   }
//   return (
//     <div>
//       <button onClick={handleClick}>Click Here</button>
//       <div>Hey</div>
//     </div>
//   )
// }

// // showScore = connect()(showScore)

// export default showScore