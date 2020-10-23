import Net from './net';

export default {
    signIn(data) {
        return Net.post('/login/', data);
    },
    getLoginUser() {
        return Net.get('/user/self/');
    },
    logOut() {
        return Net.get('/logout/');
    },
    test(){
        return Net.get('/');
    }
};
