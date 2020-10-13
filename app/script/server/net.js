import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {Notification} from 'element-ui';
import Env from './env';

const qs = require('qs');

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

// 附件请求
const axiosUpload = Vue.axios.create({
    baseURL: Env.baseURL,
    headers: {'Content-Type': 'multipart/form-data'},
});

const request = function (api, type, data, progress) {
    let axiosRequest;
    const fullURL = Env.baseURL + api;
    const token = localStorage.getItem('apm_token');

    if (type === 'download') {
        axiosRequest = Vue.axios.get(api, {
            headers: {Authorization: `Bearer ${token}`},
            responseType: 'blob',
        });
    } else if (type === 'file') {
        axiosRequest = axiosUpload.post(fullURL, data, {
            headers: {Authorization: `Bearer ${token}`},
            onUploadProgress: progress,
        });
    } else if (type === 'get') {
        axiosRequest = Vue.axios.get(fullURL, {
            headers: {Authorization: `Bearer ${token}`},
            params: data,
        });
    } else if (type === 'json_post') {
        axiosRequest = Vue.axios.post(fullURL, data, {
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        });
    } else {
        axiosRequest = Vue.axios.post(fullURL, null, {
            headers: {Authorization: `Bearer ${token}`},
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
    });
};

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
};
