import JiraApi from './api'

import ProjectPicker from './components/ProjectPicker.vue'
import UserPicker from './components/UserPicker.vue'
import IssueTypePicker from './components/IssueTypePicker.vue'

export default {
    install(Vue, options = {}) {
        Vue.component('va-project-picker', ProjectPicker);
        Vue.component('va-user-picker', UserPicker);
        Vue.component('va-issue-type-picker', IssueTypePicker);

        Vue.prototype.$jira = new JiraApi();
    }
};