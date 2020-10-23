import Net from './net';

export default {
    getMenu(data) {
        return Net.get('/menu/list/', data);
    },
};
