import {PluginFunction} from "vue";

import JiraApi from './api'
import {registerAll} from './imports'

export class VueAuiJiraExtrasOptions {
}

const VueAuiJiraExtras: PluginFunction<VueAuiJiraExtrasOptions> = (Vue, options) => {
    registerAll(Vue);
    Vue.prototype.$jira = new JiraApi();
};

export default VueAuiJiraExtras;
export {default as JiraApi} from './api'
