import Net from './net';
import Common from "../common";
import Config from "../config";

export default {
    saveUser(data) {
        return Net.jsonPost('/user/', data);
    },
    updateUser(data) {
        return Net.put('/user/' + data.id + '/', data);
    },
    getUsers(data) {
        return Net.jsonGet('/user/list/', data);
    },
    getUser(data) {
        return Net.get('/user/' + data.id + '/');
    },
    deleteUser(data) {
        return Net.delete('/user/' + data.id + '/');
    },
    disableNormalStudent() {
        return Net.put('/user/disableNormalStudent/');
    },
    normalDisableStudent() {
        return Net.put('/user/normalDisableStudent/');
    },
    getAllTeacher() {
        let data = Common.copyObject(Config.allPage)
        data.type = 'TEACHER';
        data.login = false;
        return this.getUsers(data)
    },
    getNormalTeacher() {
        let data = Common.copyObject(Config.allPage)
        data.type = 'TEACHER'
        data.login = false
        data.state = 'NORMAL'
        return this.getUsers(data)
    },
};
