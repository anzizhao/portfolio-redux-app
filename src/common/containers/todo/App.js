import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters, exportTodo,   initTodo } from '../../actions/todo/actions'

import { bindActionCreators } from 'redux'

import * as todoActions  from '../../actions/todo/actions'
import AddTodo from '../../components/todo/AddTodo'
import TodoList from '../../components/todo/TodoList'
import Footer from '../../components/todo/Footer'



class App extends Component {
    componentWillMount() {
        this.props.dispatch(initTodo());
    }

  render() {
    const { dispatch, visibleTodos, visibilityFilter, actions, sort } = this.props

    return (
      <div>
        <AddTodo
          todos={visibleTodos}
          onAddSubmit={text => dispatch(addTodo(text))} />
        <TodoList
          todos={visibleTodos}
          actions={actions}
          onExportClick={() => dispatch(exportTodo()) }
          onTodoClick={id => dispatch(completeTodo(id))} />
        <Footer
          filter={visibilityFilter}
          sort={ sort } 
          onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
          onSortChange={nextSort => actions.setSort(nextSort) }

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
  sort : PropTypes.oneOf([
                         'SORT_ORIGIN',
                         'SORT_IMPORTANCE_UP',
                         'SORT_IMPORTANCE_DOWN',
                         'SORT_URGENCY_UP',
                         'SORT_URGENCY_DOWN',
                         'SORT_DIFFICULTY_UP',
                         'SORT_DIFFICULTY_DOWN'
  ]).isRequired,
  visibilityFilter: PropTypes.oneOf([
                                    'SHOW_ALL',
                                    'SHOW_COMPLETED',
                                    'SHOW_ACTIVE'
  ]).isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired
}

function sortTodos (todos, cmd) {
    let cmds = todoActions.sorts   
    switch (cmd) {
        case cmds.SORT_IMPORTANCE_UP:
            return todos.sort((a, b)=>{
                return a.importance - b.importance 
        })
        case cmds.SORT_IMPORTANCE_DOWN:
            return todos.sort((a, b)=>{
                return b.importance - a.importance 
        })
        case cmds.SORT_URGENCY_UP:
            return todos.sort((a, b)=>{
                return a.urgency- b.urgency
        })
        case cmds.SORT_URGENCY_DOWN:
            return todos.sort((a, b)=>{
                return b.urgency- a.urgency
        })
        case cmds.SORT_DIFFICULTY_UP:
            return todos.sort((a, b)=>{
                return a.difficulty - b.difficulty
        })
        case cmds.SORT_DIFFICULTY_DOWN:
            return todos.sort((a, b)=>{
                return b.difficulty - a.difficulty
        })
        //cmds.SORT_ORIGIN
        default: 
            return todos.sort((a, b)=>{
                return b.id - a.id
        })
    }
}

function selectTodos(todos, filter, sort ) {
  switch (filter) {
    default:
    case VisibilityFilters.SHOW_ALL:
      return sortTodos( todos, sort)
    case VisibilityFilters.SHOW_COMPLETED:
      return sortTodos(  todos.filter(todo => todo.completed) , sort)
    case VisibilityFilters.SHOW_ACTIVE:
      return sortTodos(todos.filter(todo => !todo.completed), sort)
  }
}

function select(state) {
  return {
    undoDisabled: state.todo.todos.past.length === 0,
    redoDisabled: state.todo.todos.future.length === 0,
    visibleTodos: selectTodos(state.todo.todos.present, state.todo.visibilityFilter, state.todo.sort ),
    visibilityFilter: state.todo.visibilityFilter,
    sort: state.todo.sort,
    layout : state.layout,
    tags: state.tags
  }
}

function mapDispatchToProps(dispatch) {
  return {
      dispatch,
      actions: bindActionCreators(todoActions, dispatch)
  }
}

export default connect(select, mapDispatchToProps)(App)
