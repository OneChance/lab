import Net from '../net';

export default {
    saveSB(data) {
        if (data.id) {
            return Net.put('/sample/bank/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/question/bank/', data);
        }
    },
    getSB(data) {
        return Net.get('/question/bank/' + data.id + '/');
    },
    deleteSB(data) {
        return Net.delete('/question/bank/' + data.id + '/');
    },
    getSBs(data) {
        return Net.get('/question/bank/list/', data);
    },
    saveSample(data) {
        if (data.id) {
            return Net.put('/question/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/question/', data);
        }
    },
    getSample(data) {
        return Net.get('/question/' + data.id + '/');
    },
    deleteSample(data) {
        return Net.delete('/question/' + data.id + '/');
    },
    getSamples(data) {
        return Net.get('/question/list/', data);
    },
};
