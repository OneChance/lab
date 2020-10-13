import Net from './net';

export default {
  getMenu() {
    return Net.get('/menu/list/');
  },
};
