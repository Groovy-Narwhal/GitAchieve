export default actions = {
  addTodo(text) {
    return {
      type: 'ADD_TODO',
      text
    }
  }
}
