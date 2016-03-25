import React, { Component } from 'react';
import Banner from './layout/Banner';
import TheaterJs from 'theaterjs';

class Home extends Component {

    constructor(props){
        super(props);
        this.eventToggleSidebar = this.eventToggleSidebar.bind(this)
    }

    componentDidMount(){
        let theater = TheaterJs()
        theater
        .addActor('single-dog')
        .addActor('programmer')
        //.addActor('current-status')
        //.addActor('concern-hope')

        let ffSentence = '本人男，单着，'
        let fsSentence = ' 喜欢妮可罗宾。'
        let sSentence = '属于小黑屋型程序员，有志于利用技术改变一些事情。'

        theater
        .addScene('single-dog:' +  ffSentence ,500, fsSentence,  1000)
        //.addScene( - (ffSentence.length + fsSentence.length) )
        .addScene('programmer:' + sSentence , 1500)
        .addScene( - sSentence.length )

        //.addScene('current-status:现从事前端开发, ，关注<em>可复用</em>, <em>可维护</em>,<em>高性能</em>,<em>前沿的</em> 技术。', 1000)
        //.addScene('concern-hope: 对js近几年的发展充满惊讶', 1000)
        .addScene(theater.replay)

    }

    eventToggleSidebar(e) {
        e.preventDefault();
        this.props.toggleSidebar(!this.props.layout.sidebarOpen);
    }


    render() {

                    //<div id="current-status"></div>
                    //<div id="concern-hope"></div>
        return (
            <div className="posts">
            <div className="post banner">
                <h2 className="post-title" style={{height: '4rem'}}>
                    <div id="single-dog"></div>
                    <div id="programmer"></div>
                </h2>
                <h4 className="post-title">
                    <p> 
                        现从事前端开发, ，关注<em>可复用</em>, <em>可维护</em>,<em>高性能</em>,<em>前沿的</em> 技术。
                    </p>
                    <p>         
                        对js近几年的发展充满惊讶。
                    </p>
                </h4>
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
            <h4>客户端服务器端</h4>
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
            <em><b>*</b> <a href="https://github.com/anzizhao">我的github仓库</a>记录使用这些技术的项目查看</em><br/>
            </div>

            </div>


            <div className="post clearfix">

            <h2>工作过的公司:</h2>

            <ul className="clients">
            <li className="hikvision-logo">杭州海康威视数字技术有公司</li>
            <li className="koalac-logo">考拉先生</li>
            </ul>

            </div>

            <Banner />

            </div>

            );
            }
            }

            export default Home;
