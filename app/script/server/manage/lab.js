import Net from '../net';

export default {
    save(data) {
        if (data.id) {
            return Net.put('/laboratory/' + data.id + '/', data);
        } else {
            return Net.jsonPost('/laboratory/', data);
        }
    },
    get(data) {
        return Net.get('/laboratory/' + data.id + '/');
    },
    delete(data) {
        return Net.delete('/laboratory/' + data.id + '/');
    },
    gets(data) {
        return Net.get('/laboratory/list/', data);
    },
    timeZone() {
        return [{id: 8, name: '8:00--9:00'},
            {id: 9, name: '9:00--10:00'},
            {id: 10, name: '10:00--11:00'},
            {id: 11, name: '11:00--12:00'},
            {id: 12, name: '12:00--13:00'},
            {id: 13, name: '13:00--14:00'},
            {id: 14, name: '14:00--15:00'},
            {id: 15, name: '15:00--16:00'},
            {id: 16, name: '16:00--17:00'},
            {id: 17, name: '17:00--18:00'}]
    }
};
