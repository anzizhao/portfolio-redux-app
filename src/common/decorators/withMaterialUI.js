import React, { Component } from 'react';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
//import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import DarkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme';

export default function withMaterialUI(ComposedComponent) {
  return class MaterialUI extends Component {
    /*
     For more details: https://github.com/callemall/material-ui#usage
     Pass material-ui theme through child context
     We are doing this here so we don't have to do it anywhere else.
     */
    static childContextTypes = {
      muiTheme: React.PropTypes.object
    };

    getChildContext() {
      return {
        muiTheme: ThemeManager.getMuiTheme(DarkRawTheme)
      };
    }

    render() {
      const { context, ...other } = this.props;
      return <ComposedComponent {...other} />;
    }
  };
}
