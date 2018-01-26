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

export function getProjects() {
    return api.get('/rest/api/2/project');
}

export function getProject(projectKeyOrId) {
    return api.get(`/rest/api/2/project/${projectKeyOrId}`);
}