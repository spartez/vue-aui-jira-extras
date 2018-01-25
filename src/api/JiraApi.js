import * as JiraCloudApi from './JiraCloudApi'
import * as JiraServerApi from './JiraServerApi'
import * as JiraDocsMocks from './JiraDocsMocks'

function makeApi() {
    const isDocs = process.env.NODE_ENV === 'dev';
    const isCloud = window.AP && AP.jira && AP.user;
    const isServer = !isDocs && !isCloud;

    if (isDocs) {
        return JiraDocsMocks;
    } else if (isCloud) {
        return JiraCloudApi
    } else if (isServer) {
        return JiraServerApi
    }
}

const api = makeApi();

export function getProjects() {
    return api.get('/rest/api/2/project');
}