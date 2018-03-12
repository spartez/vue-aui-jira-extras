import * as JiraCloudApi from './JiraCloudApi'
import * as JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

export default class JiraApi {
    private api = this.detectApi();

    private detectApi() {
        if (process.env.NODE_ENV === 'dev') {
            return JiraMocksApi;
        } else if (window.AP && window.AP.jira && window.AP.user) {
            return JiraCloudApi;
        } else if (window.top.JIRA && window.top.JIRA.Ajax) {
            return JiraServerApi;
        }
        return JiraMocksApi;
    }

    getProject(projectKeyOrId): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getProject(projectKeyOrId)
            : this.api.get(`/rest/api/2/project/${projectKeyOrId}`);
    }

    getProjects(): Promise<Array<object>> {
        const projects = this.api.isMock
            ? JiraMocksApi.getProjects()
            : this.api.get('/rest/api/2/project');
        return projects as Promise<Array<object>>;
    }

    getUser(userKey): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getUser(userKey)
            : this.api.get(`/rest/api/2/user?key=${userKey}`);
    }

    getUsers(username): Promise<Array<object>> {
        let users = this.api.isMock
            ? JiraMocksApi.getUsers(username)
            : this.api.get(`/rest/api/2/user/search?username=${username}`);
        return users as Promise<Array<object>>;
    }

    getIssueCreateMeta(): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getIssueCreateMeta()
            : this.api.get(`/rest/api/2/issue/createmeta`);
    }
}