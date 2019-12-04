/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import React from 'react';
import Comment from './Comment';
import ApiAction from '../actions/ApiAction';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            comments: [],
            error: undefined,
        }
    }

    componentDidMount() {
        ApiAction.getComments()
            .then(res => {
                if (res.data.success) {
                    this.setState({comments: res.data.comments});
                } else {
                    this.setState({error: res.data.message});
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({error: err.message})
            })
    }

    render() {
        let {comments} = this.state;
        console.log(comments);
        return (
            <div className="d-flex flex-column align-items-center justify-content-center pt-2">
                <div style={{minWidth: 500, minHeight: 450}} className="bg-light p-3">
                    <div className="d-flex justify-content-between w-100 mb-3">
                        <div className="h2">Comments</div>
                        <div className="">
                            <a href='/logout' className=" text-dark text-decoration-none" type="button">
                                <i className="fas fa-power-off fa-3x"></i>
                            </a>
                        </div>
                    </div>
                    <form method="post" onSubmit={this.submitComment}
                          className="d-flex justify-content-end align-items-center border rounded pr-2 bg-white mb-3">
                        <textarea className="border-0 text-left w-100" style={{resize: 'none', fontSize: '0.8rem'}}
                                  placeholder="Comment here"
                                  onChange={this.textChange}></textarea>
                        <button className="btn btn-sm btn-primary ml-2" type="submit"
                                onClick={this.submitComment}>Comment
                        </button>
                    </form>
                    <div className="pl-1">
                        {comments.map((comment, key) => {
                            console.log(comment);
                            return (
                                <Comment comment={comment} key={key}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    textChange = (e) => {
        this.setState({text: e.target.value});
    }

    submitComment = (e) => {
        e.preventDefault();
        ApiAction.postComment({text: this.state.text})
            .then(res => {
                if (res.data.success) {
                    let comments = this.state.comments;
                    comments.unshift(res.data.comment);
                    this.setState({comments: comments, text: ''});
                } else {
                    this.setState({error: res.data.message})
                }
                console.log(res)
            }).catch(err => {
            console.log(err);
            this.setState({error: err.message})
        })
    }
}

export default Comments;
