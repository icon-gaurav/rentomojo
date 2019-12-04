/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import React from 'react';
import Register from "./components/Register";
import Login from "./components/Login";
import Comments from "./components/Comments";
import {BrowserRouter, Route, Redirect} from "react-router-dom";

class App extends React.Component {

    render() {
        return (
            <div className="min-vw-100 min-vh-100 d-flex justify-content-center align-items-center">
                <BrowserRouter>
                    <Route exact path="/login" component={() => <Login/>}/>
                    <Route exact path="/register" component={() => <Register/>}/>
                    <Route exact path="/comments" component={() => <Comments/>}/>
                    {/*<Redirect exact path="/" to="/login"/>*/}
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
