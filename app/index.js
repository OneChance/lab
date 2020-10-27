import App from './script/app.js';

require('./style/css/app.scss');
require('./plugin/font-awesome/css/font-awesome.css');

window.onload = function () {
    App.init()
    App.vueG.$mount('#app')
};
