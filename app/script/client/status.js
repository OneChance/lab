export default {
    stateTagFormatter(value) {
        switch (value) {
            case 'NORMAL':
                return 'success'
            case 'DISABLE':
                return 'warning'
            case 'DELETE':
                return 'danger'
            default:
                return ''
        }
    },
    stateFormatter(value) {
        switch (value) {
            case 'NORMAL':
                return '正常'
            case 'DISABLE':
                return '禁用'
            case 'DELETE':
                return '删除'
            default:
                return ''
        }
    },
};
