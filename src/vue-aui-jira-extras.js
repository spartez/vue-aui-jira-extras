import * as JiraApi from './api'

import ProjectPicker from './ProjectPicker.vue'
import UserPicker from './UserPicker.vue'

export default {
    install(Vue, options) {
        Vue.component('va-project-picker', ProjectPicker);
        Vue.component('va-user-picker', UserPicker);

        Vue.prototype.$jira = JiraApi
    }
};