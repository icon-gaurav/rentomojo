/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reply: [{
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    r: {
        type: Boolean,
        default: false
    }

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
