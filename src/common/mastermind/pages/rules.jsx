import React, { Component, PropTypes } from 'react'
import {Router, Link} from 'react-router'

class RulesPage extends Component {
    render() {
        const style = {
            width: '90%',
            margin: '40px auto',
            fontFamily: 'Georgia',
            fontSize: '110%'
        }

        return (
            <div style={style}>
                <header>
                    <div>
                    <Link to="/mastermind/play">to play</Link>
                    </div>
                </header>
                <h2>猜颜色</h2>
                <ol>
                    <li>
                    从6种颜色中选择,允许颜色重复
                    </li>
                    <li>
                        点击检测按钮，查看结果。 红色代表
                        <ol>
                            <li>
                                黑色代表，位置和颜色都准确
                            </li>
                            <li>
                                红色代表，颜色准确,但位置不对
                            </li>
                        </ol>
                    </li>
                    <li>
                        共12次机会。
                    </li>
                </ol>
                <p>
                    have a good time. 
                </p>
            </div>
        )
    }
}


export default RulesPage
module.exports = RulesPage
