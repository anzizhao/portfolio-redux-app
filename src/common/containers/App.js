import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import * as LayoutActions from '../actions/layout';

import Home from '../components/Home'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import DarkRawTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


//@ThemeDecorator(ThemeManager.getMuiTheme(DarkRawTheme))

class App extends Component {
    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };

    constructor(props){
        super(props)
        this.eventToggleSidebar = this.eventToggleSidebar.bind(this)
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
        };
    }

    componentWillMount () {
        let doc = document
        let win = window 
        let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
        let recalc = function () {
            let docEl = doc.documentElement
            let clientWidth = docEl.clientWidth;
            if ( ! clientWidth ){
                return  
            } 
            let htmlRootSize = 20
            let referenceWidth = (clientWidth > 1000 && clientWidth < 2000 )? clientWidth: 1200 
            docEl.style.fontSize = htmlRootSize  * (clientWidth / referenceWidth ) + 'px';
        }

        recalc()
    }


    eventToggleSidebar(e) {
        e.preventDefault();
        this.props.toggleSidebar(!this.props.layout.sidebarOpen);
    }

    render() {

        const { layout, toggleSidebar } = this.props;
        const { sidebarOpen } = layout;
        const layoutClass = classNames({open : sidebarOpen});

        return (
            <div className={layoutClass}>
                <Sidebar layout={layout} toggleSidebar={toggleSidebar} />
                <div className="wrap">
                    <Header />
                    <div className="container content">


                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="mainrouter"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        {React.cloneElement(this.props.children, {
                            key: this.props.location.pathname
                        })}
                    </ReactCSSTransitionGroup>





                    </div>
                </div>
                <label className="sidebar-toggle" onClick={this.eventToggleSidebar}></label>
            </div>
        );
    }
}

                        //{!this.props.children && <Home layout={layout} toggleSidebar={toggleSidebar} />}
                        //{this.props.children}
//
function mapStateToProps(state) {
    return {
        layout : state.layout
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(LayoutActions,dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
