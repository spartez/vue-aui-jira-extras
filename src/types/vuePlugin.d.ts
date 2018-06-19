import JiraApi from '../api/index'

declare module 'vue/types/vue' {
    interface Vue {
        $jira: JiraApi;
    }
}