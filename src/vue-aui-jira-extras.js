import * as JiraApi from './api'

import ProjectPicker from './ProjectPicker.vue'
import UserPicker from './UserPicker.vue'
import IssueTypePicker from './IssueTypePicker.vue'

export default {
    install(Vue, options = {}) {
        Vue.component('va-project-picker', ProjectPicker);
        Vue.component('va-user-picker', UserPicker);
        Vue.component('va-issue-type-picker', IssueTypePicker);

        Vue.prototype.$jira = JiraApi
    }
};