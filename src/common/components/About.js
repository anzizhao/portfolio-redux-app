import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Repos from './about/Repos';

import Loader from './layout/Loader';
import Banner from './layout/Banner';

class About extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchReposIfNeeded();
  }

  render () {
    const { results, isFetching, lastUpdated, error } = this.props;
    return (
      <div>

      		<Banner />

      	  <div className="about">

      	  	<h3>关于我</h3>

      	  	<p>13年毕业，投身于安防大业，在海康工作两年，然而对工作的无感和家乡的思念，15年离职回广东发展。因一个外包项目，转向于前端技术. </p> 

      	  	<p>现从事前端开发工作，关注前端最新发展。使用npm，bower，grunt现代技术管理前端项目，使用angular+bootstrap + restful api前后端分离技术开发网站。 </p> 


      	  	<h3>关于网站</h3>

      	  	<p>这是一个单页面网站，基于react和redux技术， 参考于<a href="https://github.com/caljrimmer/portfolio-redux-app">portfolio-redux-app模板</a> 网站。这网站将用于提供小工具和展示简历 </p>
      	  	<p>如果对网站的小工具感兴趣，可以从github上获取该网站的代码<a href="https://github.com/anzizhao/portfolio-redux-app">portfolio-redux-ap</a>.</p>
      	  	<p>就像caljrimmer所说的，</p>
      	  	<p>Feel free to use this sites code for whatever you want. I hope it inspires you to build something awesome or learn something new</p>
，
	      </div>

	      <div className="repos">
	      	<h3><a href="https://github.com/anzizhao?tab=repositories" target="_blank">我的GitHub</a></h3>
	        {isFetching && results.length === 0 &&
	          	<Loader />
	        }
	        {!isFetching && error && results.length === 0 &&
	          <h3 className="post-error">There has been an Error</h3>
	        }
	        {!isFetching && !error && results.length === 0 &&
	          <h3>Empty</h3>
	        }
	        {results.length > 0 &&
	          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
	            <Repos results={results} />
	          </div>
	        }
	      </div>

      </div>
    );
  }
}

About.propTypes = {
  results: PropTypes.array.isRequired,
  error: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default About;
