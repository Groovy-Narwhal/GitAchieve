import { combineReducers } from 'redux'

function getId(state) {
  return state.todos.reduce((maxId, todo) => {
    return Math.max(todos.id, maxId);
  }, -1) + 1
}

function reducer(state = {}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      Object.assign({}, state, {
        todos: [{
          text: action.text,
          completed: false,
          id: getId(state)
        }, ...state.todos]
      })
    default:
      return state;
  }
}

const gitApp = combineReducers({
  reducer
});

export default gitApp
