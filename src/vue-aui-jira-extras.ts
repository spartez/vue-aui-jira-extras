import JiraApi from './api'
import {registerAll} from './imports'

export default class {
    install(Vue, options = {}) {
        registerAll();
        Vue.prototype.$jira = new JiraApi();
    }
};

export {default as JiraApi} from './api'
