/*
 * @author Gaurav Kumar (icon.gaurav806@gmail.com)
 */

import axios from 'axios';

class Api {
    constructor() {
        axios.default.baseURL = '/api'
    }

    get = (url) => {
        return axios({
            url: url,
            method: 'get',
        })
    }

    post = (url, params) => {
        return axios({
            url: url,
            data: params,
            method: 'post'
        })
    }

    put = (url, params) => {
        return axios({
            url: url,
            data: params,
            method: 'put'
        })
    }

    delete = (url) => {
        return axios({
            url: url,
            method: 'put'
        })
    }
}

export default new Api();
