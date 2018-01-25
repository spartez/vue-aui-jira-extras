import Vue from 'vue';
import VueAui from 'vue-aui';
import VueAuiJiraExtras from '../src/vue-aui-jira-extras';

Vue.use(VueAui);
Vue.use(VueAuiJiraExtras);

import App from './App.vue';

new Vue({
    el: '#app',
    render: h => h(App),
});
