import Net from './net';

export default {
    saveUser(data) {
        return Net.jsonPost('/user/', data);
    },
    updateUser(data) {
        return Net.put('/user/' + data.id + '/', data);
    },
    getUsers(data) {
        return Net.get('/user/list/', data);
    },
    getUser(data) {
        return Net.get('/user/' + data.id + '/');
    },
    deleteUser(data) {
        return Net.delete('/user/' + data.id + '/');
    },
};
