import Net from './net'

export default {
    upload: function (id, file, progress) {
        return Net.axiosUpload('/file/upload/?id=' + id, file, progress);
    },
}
