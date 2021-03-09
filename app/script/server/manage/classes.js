import Net from '../net';

export default {
    save(data) {
        if (data.id) {
            return Net.put('/classes/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/classes/', data);
        }
    },
    get(data) {
        return Net.get('/classes/' + data.id + '/');
    },
    delete(data) {
        return Net.delete('/classes/' + data.id + '/');
    },
    gets(data) {
        return Net.get('/classes/list/', data);
    },
};
