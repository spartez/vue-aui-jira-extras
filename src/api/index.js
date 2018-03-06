import * as JiraCloudApi from './JiraCloudApi'
import * as JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

export function detectApi() {
    if (process.env.NODE_ENV === 'dev') {
        return JiraMocksApi;
    } else if (window.AP && AP.jira && AP.user) {
        return JiraCloudApi;
    } else if (window.top.JIRA && window.top.JIRA.API) {
        return JiraServerApi;
    }
    return JiraMocksApi;
}

let api = detectApi();

export function setMode(options) {
    if (options.mode === 'server') {
        api = JiraServerApi;
        if (options.url) {
            JiraServerApi.setUrl(options.url)
        }
    }
}

export function getProject(projectKeyOrId) {
    return api.isMock
        ? JiraMocksApi.getProject(projectKeyOrId)
        : api.get(`/rest/api/2/project/${projectKeyOrId}`);
}

export function getProjects() {
    return api.isMock
        ? JiraMocksApi.getProjects()
        : api.get('/rest/api/2/project');
}

export function getUser(userKey) {
    return api.isMock
        ? JiraMocksApi.getUser(userKey)
        : api.get(`/rest/api/2/user?key=${userKey}`);
}

export function getUsers(username) {
    return api.isMock
        ? JiraMocksApi.getUsers(username)
        : api.get(`/rest/api/2/user/search?username=${username}`);
}

export function getIssueCreateMeta() {
    return api.isMock
        ? JiraMocksApi.getIssueCreateMeta()
        : api.get(`/rest/api/2/issue/createmeta`);
}