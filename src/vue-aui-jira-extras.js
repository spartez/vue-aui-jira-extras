import * as JiraApi from './api'

import ProjectPicker from './ProjectPicker.vue'

export default {
    install(Vue, options) {
        Vue.component('va-project-picker', ProjectPicker);

        Vue.prototype.$jira = JiraApi
    }
}