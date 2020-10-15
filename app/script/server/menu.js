import Net from './net';

export default {
    getMenu() {
        return new Promise(function (resolve, reject) {
            resolve({menus: [{value: 'test', children: []}]})
        })
        //return Net.get('/menu/list/');
    },
};
