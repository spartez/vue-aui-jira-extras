import {stringify} from "querystring";

import {JiraApiBase} from "./JiraApiBase";
import JiraCloudApi from './JiraCloudApi'
import JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

function detectApi(): JiraApiBase {
    if (process.env.NODE_ENV === 'dev') {
        return JiraMocksApi;
    } else if (window.AP && window.AP.jira && window.AP.user) {
        return new JiraCloudApi();
    } else if (window.top.JIRA && window.top.JIRA.Ajax) {
        // It's important that window.top line above is not executed on Cloud as it throws cross domain error there.
        return new JiraServerApi();
    }
    return JiraMocksApi;
}

// Ultimately, move to jira-api-client npm package or similar

export default class JiraApi {
    private api = detectApi();

    // App properties API

    getAppProperties(addonKey: string): Promise<Jira.EntityPropertiesKeys> {
        return this.api.get(`rest/atlassian-connect/1/addons/${addonKey}/properties`);
    }

    getAppProperty(addonKey: string, propertyKey: string): Promise<Jira.EntityProperty> {
        return this.api.get(`rest/atlassian-connect/1/addons/${addonKey}/properties/${propertyKey}`);
    }

    setAppProperty(addonKey: string, propertyKey: string, body: any): Promise<void> {
        return this.api.put(`rest/atlassian-connect/1/addons/${addonKey}/properties/${propertyKey}`, body);
    }

    deleteAppProperty(addonKey: string, propertyKey: string): Promise<void> {
        return this.api.del(`rest/atlassian-connect/1/addons/${addonKey}/properties/${propertyKey}`);
    }


    // Jira API

    getApplicationProperty(query: { key?: string, keyFilter?: string, permissionLevel?: string }): Promise<Array<Jira.ApplicationProperty>> {
        return this.api.get(`/rest/api/2/application-properties?${stringify(query)}`);
    }

    setApplicationProperty(id: string, body?: { id: string, value: string }): Promise<Array<Jira.ApplicationProperty>> {
        return this.api.put(`/rest/api/2/application-properties/${id}`, body);
    }

    getAdvancedSettings(): Promise<Array<Jira.ApplicationProperty>> {
        return this.api.get(`/rest/api/2/application-properties/advanced-settings`);
    }


    getIssuePropertyKeys(issueIdOrKey: string): Promise<Jira.EntityPropertiesKeys> {
        return this.api.get(`/rest/api/2/issue/${issueIdOrKey}/properties`)
    }

    getIssueProperty(issueIdOrKey: string, propertyKey: string): Promise<Jira.EntityProperty> {
        return this.api.get(`/rest/api/2/issue/${issueIdOrKey}/properties/${propertyKey}`)
    }

    setIssueProperty(issueIdOrKey: string, propertyKey: string, body: any): Promise<void> {
        return this.api.put(`/rest/api/2/issue/${issueIdOrKey}/properties/${propertyKey}`, body)
    }

    deleteIssueProperty(issueIdOrKey: string, propertyKey: string): Promise<void> {
        return this.api.del(`/rest/api/2/issue/${issueIdOrKey}/properties/${propertyKey}`)
    }


    getProjectPropertyKeys(projectIdOrKey: string): Promise<Jira.EntityPropertiesKeys> {
        return this.api.get(`/rest/api/2/project/${projectIdOrKey}/properties`)
    }

    getProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<Jira.EntityProperty> {
        return this.api.get(`/rest/api/2/project/${projectIdOrKey}/properties/${propertyKey}`)
    }

    setProjectProperty(projectIdOrKey: string, propertyKey: string, body: any): Promise<void> {
        return this.api.put(`/rest/api/2/project/${projectIdOrKey}/properties/${propertyKey}`, body)
    }

    deleteProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<void> {
        return this.api.del(`/rest/api/2/project/${projectIdOrKey}/properties/${propertyKey}`)
    }


    getUserPropertyKeys(query: { userKey: string } | { username: string }): Promise<Jira.EntityPropertiesKeys> {
        return this.api.get(`/rest/api/2/user/properties?${stringify(query)}`)
    }

    getUserProperty(propertyKey: string, query: { userKey: string } | { username: string }): Promise<Jira.EntityProperty> {
        return this.api.get(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`)
    }

    setUserProperty(propertyKey: string, query: { userKey: string } | { username: string }, body: any): Promise<void> {
        return this.api.put(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`, body)
    }

    deleteUserProperty(propertyKey: string, query: { userKey: string } | { username: string }): Promise<void> {
        return this.api.del(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`)
    }


    getProject(projectKeyOrId: string): Promise<Jira.Project> {
        return this.api.isMock
            ? JiraMocksApi.getProject(projectKeyOrId)
            : this.api.get(`/rest/api/2/project/${projectKeyOrId}`);
    }

    getProjects(): Promise<Array<Jira.Project>> {
        return this.api.isMock
            ? JiraMocksApi.getProjects()
            : this.api.get('/rest/api/2/project');
    }

    getUser(userKey: string): Promise<Jira.User> {
        return this.api.isMock
            ? JiraMocksApi.getUser(userKey)
            : this.api.get(`/rest/api/2/user?key=${userKey}`);
    }

    getUsers(username: string): Promise<Array<Jira.User>> {
        return this.api.isMock
            ? JiraMocksApi.getUsers(username)
            : this.api.get(`/rest/api/2/user/search?username=${username}`);
    }

    getGroupsForPicker(query: { query: string }) {
        return this.api.isMock
            ? JiraMocksApi.getGroupsForPicker(query.query)
            : this.api.get(`/rest/api/2/groups/picker?${stringify(query)}`);
    }

    getIssueCreateMeta(): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getIssueCreateMeta()
            : this.api.get(`/rest/api/2/issue/createmeta`);
    }
}