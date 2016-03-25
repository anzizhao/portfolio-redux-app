import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import layout from './layout';
import { reposByUser } from './about';
import mastermind  from '../mastermind/reducers';

import todo from './todo';

const rootReducer = combineReducers({
  layout : layout,
  repos : reposByUser,
  router : routerStateReducer,
  todo,
  mastermind,
});

export default rootReducer;
