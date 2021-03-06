import Env from './env';
import App from "../app";

const qs = require('qs');

export default {
    get(api, data) {
        return request(api, 'get', data);
    },
    jsonGet(api, data) {
        return request(api, 'json_get', data);
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
    },
    getToken() {
        return _getToken()
    }
};

const _getToken = function () {
    //获取token
    let token = localStorage.getItem('ssm_token');
    if (!token) {
        token = App.vueG.$cookie.get('ssm_token')
    }
    if (!token) {
        token = '';
    }
    return token
}

const request = function (api, type, data, progress) {
    let axiosRequest;
    const fullURL = Env.baseURL + api;

    let token = _getToken()

    if (type === 'download') {
        axiosRequest = App.vueG.axios.get(api, {
            headers: {Authorization: token},
            responseType: 'blob',
        });
    } else if (type === 'file') {
        axiosRequest = App.vueG.axios.create({
            baseURL: Env.baseURL,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            },
            onUploadProgress: progress
        }).post(fullURL, data, {
            cancelToken: data.get('formFile').source.token
        });
    } else if (type === 'get') {
        axiosRequest = App.vueG.axios.get(fullURL, {
            headers: {Authorization: token},
            params: data,
        });
    } else if (type === 'json_get') {
        axiosRequest = App.vueG.axios.get(fullURL, {
            headers: {Authorization: token},
            params: data,
            paramsSerializer(params) {
                return qs.stringify(params, {arrayFormat: 'brackets', allowDots: true});
            },
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
        return response.data;
    }).catch((e) => {

        if (e.message && e.message === 'cancel-upload') {

        } else {
            if (App.vueG.$route.path.indexOf('/wx/') !== -1) {
                App.vueG.$message({
                    showClose: true,
                    message: e.response.data.error_msg ? e.response.data.error_msg : '服务异常',
                    type: 'error',
                    duration: 5000
                });
            } else {
                let msg = e.response.data.error_msg ? e.response.data.error_msg : '服务异常'
                App.vueG.$notify.error({
                    title: '错误',
                    duration: msg.length * 1000,
                    message: msg,
                });
            }

            if (e.response.data.error_code === 1001) {
                if (App.vueG.$route.path.indexOf('/wx/') !== -1) {
                    localStorage.setItem("currentPath", App.vueG.$route.fullPath);
                    App.vueG.$router.push('/wx/loginM').catch(err => err);
                } else {
                    App.vueG.$router.push('/sign').catch(err => err);
                }
            } else {

            }
        }

        return new Promise((resolve, reject) => {
            reject(e)
        })
    });
};
