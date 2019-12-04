var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
const User = require('../db/User');
const Comment = require('../db/Comment');
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html');
});

router.get('/register', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.sendFile(path.join(__dirname, '../public/index.html'));

    } else {
        res.redirect('/comments');
    }
});

router.get('/login', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.sendFile(path.join(__dirname, '../public/index.html'));

    } else {
        res.redirect('/comments');
    }
});

router.get('/comments', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.redirect('/login');
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('session');
    res.redirect('/login');
});

router.get('/api/logout', (req, res, next) => {
    res.clearCookie('session');
    res.send({success: true})
})

router.get('/api/check', (req, res, next) => {
    let username = req.query.username;
    User.findOne({username: username})
        .then(user => {
            if (user) {
                res.send({success: true, valid: false});
            } else {
                res.send({success: true, valid: true, username: username});
            }
        })
        .catch(err => {
            console.log(err);
            res.send({success: false, valid: false});
        })
});

router.post('/api/register', (req, res, next) => {
    let user = req.body.user;
    User.findOne({username: user.username})
        .then(u => {
            if (u) {
                res.send({success: false, error: true, message: "user with this username already exists"});
            } else {
                let newUser = new User(user);
                newUser.save()
                    .then(savedUser => {
                        res.send({success: true, username: savedUser.username, id: user._id});
                    })
                    .catch(err => {
                        console.log(err);
                        res.send({success: false, error: true, message: "internal server error"})
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.send({success: false, error: true, message: "internal server error"});
        })

});

router.post('/api/login', auth.login, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, message: "invalid credentials"});

    } else {
        res.send({success: true, id: req.user._id, username: req.user.username});
    }
});

router.get('/api/comments/:id', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, errorCode: 401, message: "invalid credentials"});

    } else {
        Comment.findById(req.params.id)
            .populate('user', '_id username name')
            .exec()
            .then(comment => {
                res.send({success: true, comment: comment})
            })
            .catch(err => {
                console.log(err);
                res.send({success: false, error: true, errorCode: 404, message: "Comment not found"})
            })
    }
});

router.get('/api/comments', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, errorCode: 401, message: "invalid credentials"});

    } else {
        Comment.find({r: false})
            .populate({
                path: 'user',
                select: 'name _id username',
            })
            .sort({updatedAt: -1})
            .exec()
            .then((comments) => {
                res.send({success: true, comments: comments});
            })
            .catch(err => {
                console.log(err);
                res.send({success: false, error: true, message: "internal server error", comments: []})
            })
    }
});

router.post('/api/comments', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, errorCode: 401, message: "invalid credentials"});

    } else {
        let newComment = new Comment(req.body.comment);
        newComment.user = req.user;
        newComment.updatedAt = Date.now();
        newComment.createdAt = Date.now();
        newComment.save()
            .then(comment => {
                res.send({success: true, comment: comment});
            })
            .catch(err => {
                console.log(err);
                res.send({success: false, error: true, errorCode: 500, message: "internal server error"});
            })
    }
});

router.post('/api/comments/:id/reply', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, errorCode: 401, message: "invalid credentials"});

    } else {
        Comment.findById(req.params.id)
            .then(comment => {
                if (comment) {
                    let newComment = new Comment(req.body.comment);
                    newComment.user = req.user;
                    newComment.updatedAt = Date.now();
                    newComment.createdAt = Date.now();
                    newComment.r = true;
                    newComment.save()
                        .then(savedComment => {
                            comment.reply.push({comment: savedComment});
                            comment.save()
                                .then(com => {
                                    res.send({success: true, comment: savedComment});
                                })
                                .catch(err => {
                                    console.log(err);
                                    Comment.deleteById(savedComment._id)
                                        .then(comn => {
                                            res.send({
                                                success: false,
                                                error: true,
                                                errorCode: 500,
                                                message: "internal server error"
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            res.send({
                                                success: false,
                                                error: true,
                                                errorCode: 500,
                                                message: "internal server error"
                                            });
                                        })
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.send({
                                success: false,
                                error: true,
                                errorCode: 500,
                                message: "internal server error"
                            });
                        })
                } else {
                    res.send({
                        success: false,
                        error: true,
                        errorCode: 404,
                        message: "Comment not found. You can't reply to this comment"
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    success: false,
                    error: true,
                    errorCode: 404,
                    message: "Comment not found. You can't reply to this comment"
                })
            })
    }
});

router.put('/api/comments/:id', auth.authorize, (req, res, next) => {
    if (req.error) {
        res.send({success: false, error: true, errorCode: 401, message: "invalid credentials"});

    } else {

        Comment.findById(req.params.id)
            .then(comment => {
                if (comment) {
                    if (comment.user == req.user._id) {
                        comment.text = req.body.comment.text;
                        comment.updatedAt = Date.now();
                        comment.save()
                            .then(com => {
                                res.send({success: true, comment: com});
                            })
                            .catch(err => {
                                console.log(err);
                                res.send({
                                    success: false,
                                    error: true,
                                    errorCode: 500,
                                    message: "internal server error"
                                });
                            })
                    } else {
                        res.send({success: false, error: true, erroCode: 403, message: 'unauthorized edit denied'})
                    }
                } else {
                    res.send({
                        success: false,
                        error: true,
                        errorCode: 404,
                        message: "Comment not found. You can't updated this comment."
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    success: false,
                    error: true,
                    errorCode: 404,
                    message: "Comment not found. You can't updated this comment."
                })
            })
    }
});
module.exports = router;
