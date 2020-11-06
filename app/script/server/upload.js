import Net from './net'

export default {
    upload: function (file, progress) {
        return Net.axiosUpload('/file/upload/', file, progress);
    },
}
