import JiraApi from './index'

declare global {
    // Don't export this
    interface Window {
        AP: any;
        AJS: any;
        JIRA: any;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $jira: JiraApi;
    }
}