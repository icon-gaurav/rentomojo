/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import React from 'react';
import ApiAction from '../actions/ApiAction';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            edit: false,
            text: '',
            reply: false,
            error: undefined,
            replies: []
        }
    }

    componentDidMount() {
        let comment = this.state.comment;
        let replies = this.state.replies;
        comment.reply.map(rep => {
            ApiAction.getComment(rep.comment)
                .then(res => {
                    if (res.data.success) {
                        replies.push(res.data.comment);
                        this.setState({replies: replies})
                    } else {
                        console.log(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err);

                })
        })
    }

    render() {
        let {comment, edit, text, reply, replies, error} = this.state;
        return (
            <div className="pb-2">
                <div className="d-flex justify-content-between pl-1 pr-1" style={{fontSize: 10}}>
                    <div>{comment.user.name}</div>
                    <div>{comment.createdAt.toString().substring(11, 16)}</div>
                </div>
                <div className="border rounded bg-white text-left">
                    {edit ?
                        <div>
                            <div className="d-flex justify-content-end align-items-center border rounded pr-2 bg-white">
                            <textarea className="border-0 text-left w-100 p-1"
                                      style={{resize: 'none', fontSize: '0.8rem'}}
                                      value={text} autoFocus={true}
                                      onChange={this.textChange}></textarea>
                                <button className="btn btn-sm btn-primary ml-2" onClick={this.edit}>Edit</button>
                            </div>
                            {error ? <div className="text-danger" style={{fontSize: '0.6rem'}}>{error}</div> : ''}
                        </div>
                        :
                        <pre className="text-left p-1 mb-0">{comment.text}</pre>}
                    {reply ? this.renderReply() : ''}
                    <div className="d-flex">
                        {localStorage.getItem('session_user') == comment.user._id ?
                            <button className="btn btn-sm pb-0" style={{fontSize: 11}}
                                    onClick={() => {
                                        if (localStorage.getItem('session_user') == comment.user._id) {
                                            this.setState({
                                                edit: !edit,
                                                text: comment.text,
                                                reply: false,
                                                error: undefined
                                            })
                                        } else {
                                            this.setState({
                                                edit: false,
                                                error: 'You are not authorized to edit this comment',
                                                text: comment.text,
                                                reply: false
                                            })
                                        }
                                    }}>Edit
                            </button>
                            : ''}
                        <button className="btn btn-sm pb-0" style={{fontSize: 11}}
                                onClick={() => this.setState({reply: !reply, edit: false, error: undefined})}>Reply
                        </button>
                    </div>
                </div>
                {replies.length > 0 ?
                    <div className="pl-2 pt-2" style={{borderLeft: '1px dashed #D4D4D4'}}>
                        {replies.map((rep, key) => <Comment comment={rep} key={key}/>)}
                    </div>
                    : ''}
            </div>
        );
    }


    renderReply = () => {
        let {error} = this.state;
        return (
            <div className="pl-2 pr-2">
                <div className="d-flex justify-content-end align-items-center border rounded pr-2 bg-white">
                        <textarea className="border-0 text-left w-100" style={{resize: 'none', fontSize: '0.8rem'}}
                                  placeholder="Leave a reply here"
                                  onChange={this.textChange}></textarea>
                    <button className="btn btn-sm btn-primary ml-2" onClick={this.reply}>Reply</button>
                </div>
                {error ? <div className="text-danger" style={{fontSize: '0.6rem'}}>{error}</div> : ''}
            </div>
        );
    }

    reply = (e) => {
        ApiAction.replyComment(this.state.comment, {text: this.state.text})
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    let reply = res.data.comment;
                    let comment = this.state.comment;
                    comment.reply.push({comment: reply});
                    this.setState({comment: comment, reply: false});
                } else {
                    this.setState({error: res.data.message});
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({error: err.message})
            })
    }

    textChange = (e) => {
        this.setState({text: e.target.value});
    }

    edit = () => {
        let {comment, text} = this.state;
        comment.text = text;
        ApiAction.editComment(comment)
            .then(res => {
                if (res.data.success) {
                    comment.updatedAt = res.data.comment.updatedAt;
                    this.setState({comment: comment, edit: false})
                } else {
                    this.setState({error: res.data.message})
                }
                console.log(res)
            })
            .catch(err => {
                console.log(err);
                this.setState({error: err.message})
            })

    }

}

export default Comment;
