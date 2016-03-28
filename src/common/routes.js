import { Route, NotFoundRoute, DefaultRoute, IndexRoute} from "react-router";
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

function getPlay (location, cb) {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/play-game'))
    })
}
function getHome(location, cb) {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/home'))
    })
}
function getReplayGames(location, cb) {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/replay-games'))
    })
}
function getReplay(location, cb) {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/replay'))
    })
}
function getRules (location, cb) {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/rules'))
    })
}

//component={require('./mastermind/pages/play-game')}
                    //<IndexRoute component={require('./mastermind/pages/home')} />,
// second dynamic load 
const loadMastermindAsync = () => (location, cb) => {
    require.ensure([], (require) => {
         cb(null, [ 
                 <Route path="home" getComponent = { getHome } />,
                 <Route path="play" getComponent = { getPlay } />,
                 <Route path="replay" getComponent={getReplayGames} />,
                 <Route path="replay/:gameId" getComponent={getReplay} />,
                 <Route path="rules" getComponent={getRules} />,
         ])
    })
};

const loadMastermindIndex = () => (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./mastermind/pages/home'))
    })
};

export default (
  <Route name="app" path="/" component={App}>
      <IndexRoute  
          component={HomePage} 
      />
      <Route 
          path="home" 
          component={HomePage} 
      />
      <Route 
            path="todo" 
            getComponent={loadContainerAsync(require('bundle?lazy!./containers/todo/App'))}
      />
      <Route 
          path="mindmap" 
          getComponent={loadContainerAsync(require('bundle?lazy!./components/MindMap'))}
      />
      <Route 
          path="mastermind" 
          getChildRoutes={ loadMastermindAsync() }
          getIndexRoute={ loadMastermindIndex() }
          getComponent={loadContainerAsync(require('bundle?lazy!./mastermind/pages/master'))}
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
          //getIndexRoute={loadMastermindIndex}
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
