import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/lib/text-field';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render () {
        const { results, isFetching, lastUpdated, error } = this.props;
        return (
            <Card>
                <CardHeader
                    title="Login"
                    subtitle="Subtitle"
                />
                <CardText>
                    <form class="form" action="/api/v1.0/login">
                        <TextField
                            floatingLabelText="用户名"
                            fullWidth
                            onEnterKeyDown = { this.handleEnterKeyDown }
                            ref="iAddTodo" 
                        />


                        <div class="form-group form-group-label">
                            <div class="row">
                                <div class="col-lg-8 col-lg-push-2">
                                    <label class="floating-label" for="login-username">Username</label>
                                    <input class="form-control" id="login-username" type="text">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group form-group-label">
                                <div class="row">
                                    <div class="col-lg-8 col-lg-push-2">
                                        <label class="floating-label" for="login-password">Password</label>
                                        <input class="form-control" id="login-password" type="password">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-lg-8 col-lg-push-2">
                                            <button class="btn btn-block btn-blue">Sign In</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-lg-8 col-lg-push-2">
                                            <div class="checkbox checkbox-adv">
                                                <label for="login-remember">
                                                    <input class="access-hide" id="login-remember" name="login-remember" type="checkbox">Stay signed in
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>



                </CardText>

									<div class="card-inner">
										<p class="text-center">
											<span class="avatar avatar-inline avatar-lg">
												<img alt="Login" src="images/users/avatar-001.jpg">
											</span>
										</p>
									</div>


            </Card>



            <div class="materialContainer">
                <div class="box">
                    <div class="title">登录</div>

                    <div class="input">
                        <label for="name">用户名</label>
                        <input type="text" name="name" id="name">
                            <span class="spin"></span>
                        </div>

                        <form class="input">
                            <label for="pass">密码</label>
                            <input type="password" name="pass" id="pass">
                                <span class="spin"></span>
                            </div>

                            <div class="button login">
                                <button><span>登录</span> <i class="fa fa-check"></i></button>
                            </div>

                            <a href="" class="pass-forgot">忘记密码?</a>

                        </form>

                        <div class="overbox">
                            <div class="material-button alt-2"><span class="shape"></span></div>

                            <div class="title">注册</div>

                            <form class="input">
                                <label for="regname">用户名</label>
                                <input type="text" name="username" id="username">
                                    <span class="spin"></span>
                                </div>

                                <label for="regname">邮件</label>
                                <input type="text" name="email" id="email">
                                    <span class="spin"></span>
                                </div>

                                <div class="input">
                                    <label for="regpass">密码</label>
                                    <input type="password" name="password" id="password">
                                        <span class="spin"></span>
                                    </div>

                                    <div class="input">
                                        <label for="reregpass">重复密码</label>
                                        <input type="password" name="repassword" id="repassword">
                                            <span class="spin"></span>
                                        </div>
                                        <div class="button">
                                            <button><span>注册</span></button>
                                        </div>
                                    </div>

                                </div>
                            </form>

                        </div>


                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
};

export default Login;
