import React, { Component } from 'react';
import Banner from './layout/Banner';

class Home extends Component {

  constructor(props){
    super(props);
    this.eventToggleSidebar = this.eventToggleSidebar.bind(this)
  }

  eventToggleSidebar(e) {
    e.preventDefault();
    this.props.toggleSidebar(!this.props.layout.sidebarOpen);
  }

  render() {

    return (

      	<div className="posts">
  
  			<div className="post banner">
			    <h1 className="post-title">本人男，仍单着，喜欢罗宾这样知性的女孩。作为一位长期待在小黑屋的程序员，有志于利用技术改变一些事情。现从事前端开发，关注<em>可复用</em>, <em>可维护</em> <em>高性能</em>  <em>最新的</em> 技术发展。对js近几年发展充满惊讶</h1>

			</div>
  
		  	<div className="post clearfix">

				<h2>应用过的技能:</h2>

				<div className="skill-item clearfix">
					<h4>前端开发</h4>
					<ul className="">
						<li><em><b>*</b><b>*</b>angular</em>
						</li>
						<li><em>requirejs</em>
						</li>
						<li><em>bootstrap</em>
						</li>
						<li><em>sass</em>
						</li>
						<li><em><b>*</b><b>*</b>React</em>
							<ul>
								<li><em><b>*</b>Redux</em></li>
							</ul>
						</li>
						<li><em><b>*</b><b>*</b>Restful api</em>
						</li>
						<li><em>node</em>
							<ul>
								<li><em><b>*</b>Express</em></li>
								<li><em>Hapi</em></li>
							</ul>
						</li>

						<li><em>backbone</em>
						</li>
					</ul>
				</div>


				<div className="skill-item clearfix">
					<h4>客户端和服务器端开发</h4>
					<ul>
						<li><em><b>*</b><b>*</b>C/C++</em></li>
						<li><em>MFC</em></li>
						<li><em>gtk glade3</em></li>
						<li><em>python </em>
                            <li><em>twisted</em></li>
                        </li>
					</ul>
				</div>

				<div className="skill-item clearfix">
					<h4>单元测试</h4>
					<ul>
						<li><em>Jasmine</em></li>
						<li><em>Karma</em></li>
						<li><em>weinre</em></li>
					</ul>
				</div>

				<div className="skill-item clearfix">
					<h4>管理工具</h4>
					<ul className="clearfix">
						<li><em><b>*</b>Grunt</em></li>
						<li><em>Webpack</em></li>
						<li><em>npm</em></li>
						<li><em>bower</em></li>
					</ul>
				</div>

				<div className="skill-item clearfix">
					<h4>系统管理</h4>
					<ul className="clearfix">
						<li><em>linux</em></li>
						<li><em>node</em></li>
						<li><em><b>*</b>bash</em></li>
						<li><em><b>*</b>zsh + terminator + vim </em></li>
					</ul>
				</div>

				<div className="exclaimation">
					<em><b>*</b> github上有一些使用上面相关技术的项目 ,可跳到<a href="https://github.com/anzizhao">anzizhao repo</a>查看</em><br/>
					<em><b>**</b>这个网站是基于xxxx项目, 使用react和redux技术.</em>
				</div>

  			</div>


  			<div className="post clearfix">

				<h2>工作过的公司:</h2>

				<ul className="clients">
					<li className="goldmans-logo">杭州海康威视数字技术有公司</li>
					<li className="orange-logo">考拉先生</li>
				</ul>

			</div>

			<Banner />

  		</div>
  
    );
  }
}

export default Home;
