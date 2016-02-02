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

export default (
  <Route name="app" path="/" component={App}>
      <Route path="home" component={HomePage} />
      <Route path="todo" component={TodoPage} />
      <Route path="portfolio" component={PortfolioPage} />
      <Route path="services" component={ServicesPage} />
      <Route path="about" component={AboutPage} />
      <Route path="*" component={error404}/>
  </Route>
);
