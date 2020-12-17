export default {
    toError(vue) {
        if (vue.$route.path !== '/wx/loginM') {
            //如果已经由于登陆异常跳转到了登陆页,此处不再跳转到错误页
            vue.$router.push({path: '/wx/error'}).catch(err => err);
        }
    }
}