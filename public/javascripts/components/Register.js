/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import React from "react";
import ApiAction from '../actions/ApiAction';
import {Link} from "react-router-dom";


class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            pass: '',
            cnfPass: '',
            errors: ['', '', '', ''],
        }
    }

    render() {
        let {errors, username, name, pass, cnfPass} = this.state;
        return (
            <div className="d-flex justify-content-center">
                <form method="post" onSubmit={this.signup} style={{maxWidth: 500}}>
                    <div>
                        <h2 className="text-center">
                            <strong>Create</strong> an account.
                        </h2>
                        <ul>
                            {errors.map((err, key) => {
                                if (err.length > 0) {
                                    console.log(err)
                                    return (
                                        <li key={key} className="text-danger">{err}</li>
                                    );
                                }
                            })}
                        </ul>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Username" name="username"
                                   onChange={this.usernameChange} value={username}/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Full Name" name="name"
                                   onChange={this.nameChange} value={name}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" name="password"
                                   placeholder="Password"
                                   onChange={this.passwordChange} value={pass}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control"
                                   name="password-repeat" placeholder="Password (repeat)"
                                   onChange={this.cnfPassChange} value={cnfPass}/>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block" type="submit" onClick={this.signup}>Sign Up
                            </button>
                        </div>
                        <Link className="already" to="/login">You already have an account? Login here.</Link>
                    </div>
                </form>
            </div>
        );
    }

    cnfPassChange = (e) => {
        let value = e.target.value;
        let {errors, pass} = this.state;
        if (value != pass) {
            errors[3] = "Password didn't match"
        } else {
            errors[3] = '';
        }
        this.setState({cnfPass: e.target.value, errors: errors})
    }

    passwordChange = (e) => {
        let value = e.target.value;
        let {errors} = this.state;
        if (value.length < 6) {
            errors[2] = "Password should contain minimum 6 characters"
        } else {
            errors[2] = '';
        }
        this.setState({pass: e.target.value, errors: errors});
    }

    nameChange = (e) => {
        let value = e.target.value;
        let {errors} = this.state;
        if (value.length < 0) {
            errors[1] = "Name is required";
        } else {
            errors[1] = '';
        }
        this.setState({name: e.target.value, errors: errors});
    }

    usernameChange = (e) => {
        let value = e.target.value;
        this.setState({username: value});
        let {errors} = this.state;
        ApiAction.checkUsername(value)
            .then(res => {
                if (res.data.success) {
                    if (res.data.valid) {
                        // username doesn't exists you can proceed forward
                        errors[0] = '';
                    } else {
                        // username exists in the db change your username to something else
                        errors[0] = "Username exists. Choose another one."
                    }
                    this.setState({errors: errors});
                }
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    signup = (e) => {

        e.preventDefault();
        ApiAction.register({
            username: this.state.username,
            name: this.state.name,
            pass: this.state.pass
        })
            .then(res => {
                if (res.data.success) {
                    window.location = "/login";
                } else {
                    let errors = this.state.errors;
                    errors.push(res.data.message);
                    this.setState({errors: errors})
                }
                console.log(res)
            })
            .catch(err => {
                let errors = this.state.errors;
                errors.push(err.message);
                this.setState({errors: errors})
            })
    }
}

export default Register;
