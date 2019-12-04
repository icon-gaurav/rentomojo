/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

const User = require('../db/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authorize = (req, res, next) => {
    let token = undefined;
    if (req.cookies) {
        token = req.cookies.session;
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decode) => {
            if (err) {
                res.clearCookie('session');
                req.error = true;
                next();
            } else {
                req.user = decode.user;
                res.cookie('session', jwt.sign({user: req.user, time: Date.now()}, config.secret));
                next();
            }
        })
    } else {
        req.error = true;
        next();
    }
};

exports.login = (req, res, next) => {
    let username = req.body.username;
    let pass = req.body.pass;
    if (username != '' && pass != '') {
        User.findOne({username: username})
            .then(user => {
                if (user) {
                    if (user.pass == pass) {
                        res.cookie('session', jwt.sign({user: user, time: Date.now()}, config.secret));
                        req.user = user;
                        next();
                    } else {
                        req.error = true;
                        next();
                    }
                } else {
                    req.error = true;
                    next();
                }
            })
    } else {
        req.error = true;
        next();
    }
};

