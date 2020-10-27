import App from './script/app.js';

require('./style/css/app.scss');
require('./plugin/font-awesome/css/font-awesome.css');
require('./plugin/bootstrap/js/bootstrap.min.js');

window.onload = function () {
    App.init()
    App.vueG.$mount('#app')
};
