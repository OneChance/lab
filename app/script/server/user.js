import Net from './net';

export default {
  saveUser(data) {
    return Net.jsonPost('/user/addOrUpdate/', data);
  },
  getUsers(data) {
    return Net.get('/user/list/', data);
  },
  getUser(data) {
    return Net.get('/user/get/', data);
  },
  deleteUser(data) {
    return Net.post('/user/delete/', data);
  },
};
