import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import AddTodo from '../../components/todo/AddTodo'
import TodoList from '../../components/todo/TodoList'
import Footer from '../../components/todo/Footer'

class App extends Component {
  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props
    return (
      <div>
        <AddTodo
          onAddSubmit={text => dispatch(addTodo(text))} />
        <TodoList
          todos={visibleTodos}
          onTodoClick={id => dispatch(completeTodo(id))} />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
          onUndo={() => dispatch(ActionCreators.undo())}
          onRedo={() => dispatch(ActionCreators.redo())}
          undoDisabled={this.props.undoDisabled}
          redoDisabled={this.props.redoDisabled} />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired
}

function selectTodos(todos, filter) {
  switch (filter) {
    default:
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

function select(state) {
  return {
    undoDisabled: state.todo.todos.past.length === 0,
    redoDisabled: state.todo.todos.future.length === 0,
    visibleTodos: selectTodos(state.todo.todos.present, state.todo.visibilityFilter),
    visibilityFilter: state.visibilityFilter,
    layout : state.layout,
  }
}

export default connect(select)(App)
