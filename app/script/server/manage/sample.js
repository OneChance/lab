import Net from '../net';

export default {
    saveSB(data) {
        if (data.id) {
            return Net.put('/specimen/bank/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/specimen/bank/', data);
        }
    },
    getSB(data) {
        return Net.get('/specimen/bank/' + data.id + '/');
    },
    deleteSB(data) {
        return Net.delete('/specimen/bank/' + data.id + '/');
    },
    getSBs(data) {
        return Net.get('/specimen/bank/list/', data);
    },
    saveSample(data) {
        if (data.id) {
            return Net.put('/specimen/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/specimen/', data);
        }
    },
    getSample(data) {
        return Net.get('/specimen/' + data.id + '/');
    },
    study(data) {
        return Net.get('/specimen/study/' + data.id + '/?interval=' + data.interval);
    },
    deleteSample(data) {
        return Net.delete('/specimen/' + data.id + '/');
    },
    getSamples(data) {
        return Net.get('/specimen/list/', data);
    },
    getSampleTime(data) {
        return Net.get('/specimen/study/timing/', data);
    }
};
