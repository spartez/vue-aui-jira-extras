import * as JiraCloudApi from './JiraCloudApi'
import * as JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

export function detectApi() {
    if (process.env.NODE_ENV === 'dev') {
        return JiraMocksApi;
    } else if (window.AP && AP.jira && AP.user) {
        return JiraCloudApi;
    } else if (window.JIRA && JIRA.API) {
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
    if (api.isDev) {
        return JiraMocksApi.getProject(projectKeyOrId)
    } else {
        return api.get(`/rest/api/2/project/${projectKeyOrId}`);
    }
}

export function getProjects() {
    if (api.isDev) {
        return JiraMocksApi.getProjects()
    } else {
        return api.get('/rest/api/2/project');
    }
}

export function getUser(userKey) {
    if (api.isDev) {
        return JiraMocksApi.getUser(userKey)
    } else {
        return api.get(`/rest/api/2/user?key=${userKey}`);
    }
}

export function getUsers(username) {
    if (api.isDev) {
        return JiraMocksApi.getUsers(username)
    } else {
        return api.get(`/rest/api/2/user/search?username=${username}`);
    }
}
