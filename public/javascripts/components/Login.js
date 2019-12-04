/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import React from 'react';
import {Link} from "react-router-dom";
import ApiAction from "../actions/ApiAction";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            pass: '',
            error: undefined
        };


    }

    render() {
        let {username, error, pass} = this.state;
        return (
            <div className="d-flex justify-content-center">
                <form onSubmit={this.login} style={{maxWidth: 500}} method="post">
                    <h2 className="text-center">
                        <strong>Sign In</strong> to your account.
                    </h2>
                    {error ? <div className="text-danger">{error}</div> : ''}
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Username" name="username"
                               onChange={this.usernameChange} value={username}/>
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" name="password"
                               placeholder="Password"
                               onChange={this.passwordChange} value={pass}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" type='submit' onClick={this.login}>Sign In</button>
                    </div>
                    <Link className="already" to="/register">Don't have account? Register here.</Link>
                </form>

            </div>
        );
    }

    passwordChange = (e) => {
        let value = e.target.value;

        this.setState({pass: e.target.value});
    }

    usernameChange = (e) => {
        let value = e.target.value;
        this.setState({username: value});
    }

    login = (event) => {
        event.preventDefault();
        let {username, pass, error} = this.state;
        ApiAction.login({username: username, pass: pass})
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    localStorage.setItem('session_user',res.data.id);
                    window.location = "/comments";
                } else {
                    error = res.data.message;
                    this.setState({error: error});
                }
            })
            .catch(err => {
                error = err.message;
                this.setState({error: error});
            })
    }
}

export default Login;
