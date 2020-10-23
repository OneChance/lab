import Net from './net';

export default {
    saveRole(data) {
        return Net.jsonPost('/role/', data);
    },
    updateRole(data) {
        return Net.put('/role/' + data.id + '/', data);
    },
    getRole(data) {
        return Net.get('/role/' + data.id + '/');
    },
    deleteRole(data) {
        return Net.delete('/role/' + data.id + '/');
    },
    getRoles(data) {
        return Net.get('/role/list/', data);
    },
    saveRoleUsers(data) {
        return Net.put('/role/' + data.id + '/user/', data);
    },
    getRoleUsers(data) {
        return Net.get('/role/' + data.id + '/user/list/', data);
    },
    saveRoleMenus(data) {
        return Net.put('/role/' + data.id + '/menu/', data);
    },
    getRoleMenus(data) {
        return Net.get('/role/' + data.id + '/menu/list/', data);
    },
};
