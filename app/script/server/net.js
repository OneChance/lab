import Env from './env';
import App from "../app";

const qs = require('qs');

export default {
    get(api, data, doException) {
        return request(api, 'get', data, doException);
    },
    jsonPost(api, data, doException) {
        return request(api, 'json_post', data, doException);
    },
    post(api, data, doException) {
        return request(api, 'post', data, doException);
    },
    axiosUpload(api, data, progress, doException) {
        return request(api, 'file', data, doException, progress);
    },
    download(url, doException) {
        return request(url, 'download', null, doException);
    },
    put(api, data, doException) {
        return request(api, 'put', data, doException);
    },
    delete(api, doException) {
        return request(api, 'delete', null, doException);
    }
};

const request = function (api, type, data, doException, progress) {
    let axiosRequest;
    const fullURL = Env.baseURL + api;

    //获取token
    let token = localStorage.getItem('apm_token');
    if (!token) {
        token = App.vueG.$cookie.get('apm_token')
    }
    if (!token) {
        token = '';
    }

    if (type === 'download') {
        axiosRequest = App.vueG.axios.get(api, {
            headers: {Authorization: token},
            responseType: 'blob',
        });
    } else if (type === 'file') {
        axiosRequest = App.vueG.axios.create({
            baseURL: Env.baseURL,
            headers: {'Content-Type': 'multipart/form-data'},
        }).post(fullURL, data, {
            headers: {Authorization: token},
            onUploadProgress: progress,
        });
    } else if (type === 'get') {
        axiosRequest = App.vueG.axios.get(fullURL, {
            headers: {Authorization: token},
            params: data,
        });
    } else if (type === 'put') {
        axiosRequest = App.vueG.axios.put(fullURL, data, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else if (type === 'delete') {
        axiosRequest = App.vueG.axios.delete(fullURL, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else if (type === 'json_post') {
        axiosRequest = App.vueG.axios.post(fullURL, data, {
            headers: {'Content-Type': 'application/json', Authorization: token},
        });
    } else {
        axiosRequest = App.vueG.axios.post(fullURL, null, {
            headers: {Authorization: token},
            params: data,
            paramsSerializer(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'});
            },
        });
    }

    return axiosRequest.then((response) => {
        if (!response) {
            App.vueG.$notify.error({
                title: '错误',
                message: '响应超时',
            });
        }
        return response.data;
    }).catch((e) => {
        App.vueG.$notify.error({
            title: '错误',
            message: e.response.data.error_msg ? e.response.data.error_msg : '服务异常',
        });
        if (e.response.data.error_code === 1001) {
            App.vueG.$router.push('/sign').catch(err => err);
        }
        if (doException) {
            return {exception: true}
        } else {
            return new Promise(() => {
            })
        }
    });
};
