import {getPlatform} from './api'

import ProjectPicker from './components/ProjectPicker.vue'
import UserPicker from './components/UserPicker.vue'
import UserPickerUserKey from './components/UserPickerUserKey.vue'
import IssueTypePicker from './components/IssueTypePicker.vue'
import GroupsPicker from './components/GroupPicker.vue'

export function registerAll(Vue) {
    Vue.component('va-project-picker', ProjectPicker);
    Vue.component('va-user-picker', getPlatform() === 'server' ? UserPickerUserKey : UserPicker);
    Vue.component('va-user-picker-server', UserPickerUserKey);
    Vue.component('va-user-picker-cloud', UserPicker);

    Vue.component('va-issue-type-picker', IssueTypePicker);
    Vue.component('va-group-picker', GroupsPicker);
}
