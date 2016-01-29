import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import {Button, Navbar} from  'react-materialize';

class Sidebar extends Component {


  constructor(props){
	super(props);
	this.eventCloseSidebar = this.eventCloseSidebar.bind(this)
  }

  eventCloseSidebar (e) {
  	this.props.toggleSidebar(!this.props.layout.sidebarOpen);
  }

  render() {

    return (

    	<div className="sidebar">

		  <div className="sidebar-item sidebar-header">
              <img src="/luobin.jpg" alt="" className="circle responsive-img" />
		  </div>

		  <div className="sidebar-item  sidebar-nav">
		    <Link to="/home" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">首页</Link>
		    <Link to="/portfolio" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">简历</Link>
		    <Link to="/services" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">有趣的</Link>
		    <Link to="/about" className="sidebar-nav-item" onClick={this.eventCloseSidebar} activeClassName="active">关于</Link>
		  </div >

		  <div className="sidebar-item sidebar-footer">
		    <p>
				Visit <a href="https://github.com/anzizhao">My GitHub Repo</a><br/>
				Visit <a href="mailto:#">anzizhao@126.com</a><br/>
		    </p>
		    <p>
		    	Design based on <a href="http://lanyon.getpoole.com/"> Lanyon Theme</a> 
		    </p>

		  </div>

		</div>
    );
  }
}

export default Sidebar;
