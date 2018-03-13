import JiraApi from './index'

declare global {
    interface Window {
        AP: any;
        AJS: any;
        JIRA: any;
    }

    interface Vue {
        $jira: JiraApi;
    }
}
