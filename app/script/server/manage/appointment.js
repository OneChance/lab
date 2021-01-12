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
    getRate(data) { //根据预约id和时间段取值班教师及评分信息
        return Net.get('/teacher/score/', data);
    },
    rate(data) {
        return Net.jsonPost('/teacher/score/', data);
    }
};
