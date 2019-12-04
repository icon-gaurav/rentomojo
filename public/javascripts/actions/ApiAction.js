/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import Api from '../util/Api';

class ApiAction {

    static getComment(id) {
        return Api.get('/api/comments/' + id);
    }

    static getComments() {
        return Api.get('/api/comments');
    }

    static checkUsername(username) {
        return Api.get('/api/check?username=' + username);
    }

    static register(user) {
        return Api.post('/api/register', {user: user});
    }

    static login(user) {
        return Api.post('/api/login', user);
    }

    static editComment(comment) {
        return Api.put('/api/comments/' + comment._id, {comment: comment});
    }

    static replyComment(comment, reply) {
        return Api.post('/api/comments/' + comment._id + '/reply', {comment: reply});
    }

    static postComment(comment) {
        return Api.post('/api/comments', {comment: comment});
    }
}

export default ApiAction;
