import { Route } from "react-router";
import React from "react";

import App from "./containers/App";

//Redux Smart
import AboutPage from "./containers/AboutPage";
import HomePage from "./containers/HomePage";

import TodoPage from "./containers/todo/App";


//Redux Dumb
import PortfolioPage from "./components/Portfolio";
import ServicesPage from "./components/Services";
import error404 from "./components/404";

//import withMaterialUI from './decorators/withMaterialUI';

//@withMaterialUI

      //component={TodoPage} />
      //<Route path="todo" 
          //getComponent =  { (location, cb) => {
              //cb(null, './containers/todo/App')
          //}}
       ///>
const loadContainerAsync = bundle => (location, cb) => {
    bundle(component => {
        cb(null, component);
    });
    //cb(null, testApp);
};
export default (
  <Route name="app" path="/" component={App}>
      <Route path="home" component={HomePage} />
      <Route path="todo" 
            getComponent={loadContainerAsync(require('bundle?lazy!./containers/todo/App'))}
          />
      <Route path="portfolio" 
      component={PortfolioPage} />
      <Route path="services" component={ServicesPage} />
      <Route path="about" component={AboutPage} />
      <Route path="*" component={error404}/>
  </Route>
);
