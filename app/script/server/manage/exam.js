import Net from '../net';

export default {
    saveQB(data) {
        return Net.jsonPost('/role/', data);
    },
    updateQB(data) {
        return Net.put('/role/' + data.id + '/', data);
    },
    getQB(data) {
        return Net.get('/role/' + data.id + '/');
    },
    deleteQB(data) {
        return Net.delete('/role/' + data.id + '/');
    },
    getQBs(data) {
        return Net.get('/role/list/', data);
    },
    saveQuestion(data) {
        return Net.jsonPost('/role/', data);
    },
    updateQuestion(data) {
        return Net.put('/role/' + data.id + '/', data);
    },
    getQuestion(data) {
        return Net.get('/role/' + data.id + '/');
    },
    deleteQuestion(data) {
        return Net.delete('/role/' + data.id + '/');
    },
    getQuestions(data) {
        return Net.get('/role/list/', data);
    },
};
