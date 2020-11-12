import Net from '../net';

export default {
    save(data) {
        if (data.id) {
            return Net.put('/laboratory/book/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/laboratory/book/', data);
        }
    },
    get(data) {
        return Net.get('/laboratory/book/' + data.id + '/');
    },
    delete(data) {
        return Net.delete('/laboratory/book/' + data.id + '/');
    },
    gets(data) {
        return Net.get('/laboratory/book/list/', data);
    },
};
