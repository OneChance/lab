import Net from '../net';

export default {
    saveQB(data) {
        if (data.id) {
            return Net.put('/question/bank/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/question/bank/', data);
        }
    },
    getQB(data) {
        return Net.get('/question/bank/' + data.id + '/');
    },
    deleteQB(data) {
        return Net.delete('/question/bank/' + data.id + '/');
    },
    getQBs(data) {
        return Net.get('/question/bank/list/', data);
    },
    saveQuestion(data) {
        if (data.id) {
            return Net.put('/question/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/question/', data);
        }
    },
    getQuestion(data) {
        return Net.get('/question/' + data.id + '/');
    },
    deleteQuestion(data) {
        return Net.delete('/question/' + data.id + '/');
    },
    getQuestions(data) {
        return Net.get('/question/list/', data);
    },
    checkExam() {
        return Net.get('/exam/in/');
    },
    startExam(data) {
        return Net.get('/exam/start/', data);
    },
    commitAnswer(data) {
        return Net.jsonPost('/exam/answer/', data);
    },
    commitPaper(data) {
        return Net.jsonPost('/exam/submit/', data);
    },
    scores(data) {
        return Net.get('/exam/paper/list/', data);
    }
};
