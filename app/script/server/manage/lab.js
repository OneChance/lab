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
            {id: 17, name: '17:00--18:00'},
            {id: 18, name: '18:00--19:00'},
            {id: 19, name: '19:00--20:00'}]
    },
    getDayTeachersByDay(date, laboratoryId) {
        return Net.get('/duty/', {date: date, laboratoryId: laboratoryId});
    },
    getDayTeachers(month, laboratoryId) {
        return Net.get('/duty/list/', {date: month, laboratoryId: laboratoryId}).then(res => {
            let map = {}
            res.list.forEach(r => {
                let teachers = []
                if (r.amUser) {
                    teachers.push({type: 'day', value: r.amUser})
                }
                if (r.pmUser) {
                    teachers.push({type: 'afternoon', value: r.pmUser})
                }
                if (r.ngUser) {
                    teachers.push({type: 'night', value: r.ngUser})
                }
                map[r.date] = teachers
            })
            return map
        });
    },
    setDuty(data, laboratoryId) {
        let serverData = {
            id: data.id,
            date: data.date,
            laboratoryId: laboratoryId,
            amUser: {id: data.amUserId},
            pmUser: {id: data.pmUserId},
            ngUser: {id: data.ngUserId}
        }
        if (serverData.id) {
            return Net.put('/duty/' + data.id + '/', serverData);
        } else {
            return Net.jsonPost('/duty/', serverData);
        }
    },
    getOpenTime(month, laboratoryId) {
        return Net.get('/laboratory/opening/list/', {date: month, laboratoryId: laboratoryId}).then(res => {
            let map = {}
            res.list.forEach(r => {
                map[r.day] = '已修改'   //有日期表示已修改
            })
            return map
        });
    },
    getOpenTimeByDay(date, laboratoryId) {
        return Net.get('/laboratory/opening/', {day: date, laboratoryId: laboratoryId});
    },
    setOpenTime(data) {
        return Net.jsonPost('/laboratory/opening/', data);
    },
    getCheckinToken(data) {
        return Net.get('/attendance/code/', data);
    },
    checkIn(token) {
        return Net.get('/attendance/apply/', {token: token});
    }
};
