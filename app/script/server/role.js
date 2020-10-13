import Net from './net';

export default {
  getRoles(data) {
    return Net.get('/role/list/', data);
  },
  getRole(data) {
    return Net.get('/role/get/', data);
  },
  saveRoleUsers(data) {
    return Net.jsonPost('/role/addOrUpdate/', data);
  },
};
