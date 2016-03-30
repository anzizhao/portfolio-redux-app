import 'babel-polyfill';

import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

import createBrowserHistory from 'history/lib/createBrowserHistory'
import createHashHistory from 'history/lib/createHashHistory'

import configureStore from '../common/store/configureStore';
import routes from '../common/routes';
import {render} from 'react-dom';

import "../../styles/index.css";

//let NProgress = require('nprogress/nprogress')
//index.html  文件已经加载完车 
//加载完成
NProgress.done();


//Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
//threee url strategy
//const history = createHashHistory();
const history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const rootElement = document.getElementById('root');

//if (process.env.NODE_ENV !== 'production') {
    //require('../server/devtools')(store);
//}

render(
    <Provider store={store}>
        <ReduxRouter>
            <Router children={routes} history={history} />
        </ReduxRouter>
    </Provider>
        ,
    document.getElementById('root')
);

