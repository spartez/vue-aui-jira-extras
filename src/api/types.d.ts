import JiraApi from './index'

interface Window {
    AP: any;
    AJS: any;
    JIRA: any;
}

declare module 'vue/types/vue' {
    interface Vue {
        $jira: JiraApi;
    }
}
