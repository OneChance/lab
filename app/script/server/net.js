import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {Notification} from 'element-ui';
import Env from './env';
import VueCookie from 'vue-cookie'
import App from "../app";

const qs = require('qs');

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
Vue.use(VueCookie)

// 附件请求
const axiosUpload = Vue.axios.create({
    baseURL: Env.baseURL,
    headers: {'Content-Type': 'multipart/form-data'},
});

export default {
    get(api, data) {
        return request(api, 'get', data);
    },
    jsonPost(api, data) {
        return request(api, 'json_post', data);
    },
    post(api, data) {
        return request(api, 'post', data);
    },
    axiosUpload(api, data, progress) {
        return request(api, 'file', data, progress);
    },
    download(url) {
        return request(url, 'download');
    },
    put(api, data) {
        return request(api, 'put', data);
    },
    delete(api) {
        return request(api, 'delete');
    }
};

const request = function (api, type, data, progress) {
    let axiosRequest;
    const fullURL = Env.baseURL + api;
    let token = localStorage.getItem('apm_token');

    if (!token) {
        token = Vue.cookie.get('apm_token')
    }

    if (!token) {
        token = '';
    }

    if (type === 'download') {
        axiosRequest = Vue.axios.get(api, {
            headers: {Authorization: token},
            responseType: 'blob',
        });
    } else if (type === 'file') {
        axiosRequest = axiosUpload.post(fullURL, data, {
            headers: {Authorization: token},
            onUploadProgress: progress,
        });
    } else if (type === 'get') {
        axiosRequest = Vue.axios.get(fullURL, {
            headers: {Authorization: token},
            params: data,
        });
    } else if (type === 'put') {
        axiosRequest = Vue.axios.put(fullURL, data, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else if (type === 'delete') {
        axiosRequest = Vue.axios.delete(fullURL, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else if (type === 'json_post') {
        axiosRequest = Vue.axios.post(fullURL, data, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else {
        axiosRequest = Vue.axios.post(fullURL, null, {
            headers: {Authorization: token},
            params: data,
            paramsSerializer(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'});
            },
        });
    }

    return axiosRequest.then((response) => {
        if (!response) {
            Notification.error({
                title: '错误',
                message: '服务器响应超时',
            });
        }
        return response.data;
    }).catch((e) => {
        Notification.error({
            title: '错误',
            message: e.response.data.error_msg,
        });
        if (e.response.data.error_code === '1001') {
            App.router.$router.push('/sign').catch(err => err);
        }
        return new Promise(() => {
        })
    });
};
