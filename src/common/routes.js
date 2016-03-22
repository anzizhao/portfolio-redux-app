import { Route, NotFoundRoute, DefaultRoute } from "react-router";
import React from "react";

import App from "./containers/App";


//import TodoPage from "./containers/todo/App";


//Redux Smart
import HomePage from "./containers/HomePage";
//import AboutPage from "./containers/AboutPage";

//Redux Dumb
//import PortfolioPage from "./components/Portfolio";
//import ServicesPage from "./components/Services";
import error404 from "./components/404";

//import withMaterialUI from './decorators/withMaterialUI';

//@withMaterialUI
//first dynamic load 
const loadContainerAsync = bundle => (location, cb) => {
    bundle(component => {
        cb(null, component);
    });
};
// second dynamic load 
const loadTodoAsync = () => (location, cb) => {
    require.ensure([], (require) => {
          cb(null, require('./containers/todo/App'))
        })
};

            //getComponent={loadContainerAsync(require('bundle?lazy!./containers/todo/App'))}
            //getComponent={loadContainerAsync(require('bundle?lazy!./containers/todo/App'))}
export default (
  <Route name="app" path="/" component={App}>
      <Route 
          path="home" 
          component={HomePage} 
      />
      <Route 
            path="todo" 
            getComponent={loadContainerAsync(require('bundle?lazy!./containers/todo/App'))}
            //getComponent={loadTodoAsync()}
      />
      <Route 
          path="portfolio" 
          getComponent={loadContainerAsync(require('bundle?lazy!./components/Portfolio'))}
      />
      <Route 
          path="services" 
          getComponent={loadContainerAsync(require('bundle?lazy!./components/Services'))}
      />
      <Route 
          path="about"
          getComponent={loadContainerAsync(require('bundle?lazy!./containers/AboutPage'))}
      />

      <Route path="*" component={error404}/>
  </Route>
);
          //component={PortfolioPage} 
          //component={AboutPage} 
          //component={ServicesPage} 
      //<Route path="*" component={error404}/>
      //<NotFoundRoute 
          //component={error404}
      ///>
      //<NotFoundRoute 
          //component={error404}
      ///>
      //<DefaultRoute  component={ HomePage }/>
