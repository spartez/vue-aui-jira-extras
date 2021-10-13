import {stringify} from "querystring";

import {JiraApiBase} from "./JiraApiBase";
import JiraCloudApi from './JiraCloudApi'
import JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

export type Platform = 'development' | 'cloud' | 'server';

export function getPlatform(): Platform {
    if (process.env.NODE_ENV === 'dev') {
        return 'development';
    } else if (window.AP && window.AP.jira && window.AP.user) {
        return 'cloud';
    } else if (window.top.JIRA && window.top.JIRA.Ajax) {
        // It's important that window.top line above is not executed on Cloud as it throws cross domain error there.
        return 'server';
    }
    return 'development';
}

function makeApi(): JiraApiBase {
    switch (getPlatform()) {
        case 'development':
            return JiraMocksApi;
        case 'server':
            return new JiraServerApi();
        case 'cloud':
            return new JiraCloudApi();
    }
}

export type UserKeyOrUsername = {
    userKey?: string;
    username?: string;
};


// Ultimately, move to jira-js-client npm package or similar
export default class JiraApi {
    private api = makeApi();

    /// JIRA CORE

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


    getFields(): Promise<Array<Jira.Field>> {
        return this.api.get(`/rest/api/2/field`);
    }


    getIssue(issueIdOrKey: string, query?: {
        expand: string,
        fields: string,
        fieldsByKeys: boolean,
        properties: string,
        updateHistory: boolean
    }): Promise<Jira.Issue> {
        return this.api.get(`/rest/api/2/issue/${issueIdOrKey}?${stringify(query)}`)
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


    getCurrentUser(query?: { expand: string }): Promise<Jira.User> {
        return this.api.isMock
            ? JiraMocksApi.getUserByAccountId('adminId')
            : this.api.get(`/rest/api/2/myself?${stringify(query)}`);
    }


    getProject(projectKeyOrId: string, query?: { expand: string }): Promise<Jira.Project> {
        return this.api.isMock
            ? JiraMocksApi.getProject(projectKeyOrId)
            : this.api.get(`/rest/api/2/project/${projectKeyOrId}?${stringify(query)}`);
    }

    getProjects(query?: { expand: string, recent: number }): Promise<Array<Jira.Project>> {
        return this.api.isMock
            ? JiraMocksApi.getProjects()
            : this.api.get(`/rest/api/2/project?${stringify(query)}`);
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


    searchIssues(query?: {
        expand?: string,
        fields?: string,
        fieldsByKeys?: boolean,
        jql?: string,
        maxResults?: number,
        properties?: string,
        startAt?: number,
        validateQuery?: boolean
    }): Promise<Array<Jira.Issue>> {
        return this.api.get(`/rest/api/2/search?${stringify(query)}`)
    }


    getUserPropertyKeys(query: UserKeyOrUsername): Promise<Jira.EntityPropertiesKeys> {
        return this.api.get(`/rest/api/2/user/properties?${stringify(query)}`)
    }

    getUserProperty(propertyKey: string, query: UserKeyOrUsername): Promise<Jira.EntityProperty> {
        return this.api.get(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`)
    }

    setUserProperty(propertyKey: string, query: UserKeyOrUsername, body: any): Promise<void> {
        return this.api.put(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`, body)
    }

    deleteUserProperty(propertyKey: string, query: UserKeyOrUsername): Promise<void> {
        return this.api.del(`/rest/api/2/user/properties/${propertyKey}?${stringify(query)}`)
    }

    getUser(userIdentifier: { accountId?: string, username?: string, key?: string }): Promise<Jira.User> {
        const mockQuery = userIdentifier.accountId
            ? JiraMocksApi.getUserByAccountId(userIdentifier.accountId)
            : JiraMocksApi.getUserByUserKey(userIdentifier.key);
        return this.api.isMock
            ? mockQuery
            : this.api.get(`/rest/api/2/user?${stringify(userIdentifier)}`);
    }

    getUsers(username: string): Promise<Array<Jira.User>> {
        return this.api.isMock
            ? JiraMocksApi.getUsers(username)
            : this.api.get(`/rest/api/2/user/search?query=${encodeURIComponent(username)}`);
    }

    getGroupsForPicker(query: { query: string }) {
        return this.api.isMock
            ? JiraMocksApi.getGroupsForPicker(query.query)
            : this.api.get(`/rest/api/2/groups/picker?${stringify(query)}`);
    }

    findUsersAndGroups(query: string) {
        return this.api.isMock
            ? JiraMocksApi.findUsersAndGroups(query)
            : this.api.get(`/rest/api/2/groupuserpicker?query=${encodeURIComponent(query)}&showAvatar=true`);
    }

    getUsersFromGroup(groupname: string) {
        return this.api.isMock
            ? JiraMocksApi.getUsersFromGroup(groupname)
            : this.api.get(`/rest/api/2/group/member?groupname=${encodeURIComponent(groupname)}`)
    }

    getIssueCreateMeta(): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getIssueCreateMeta()
            : this.api.get(`/rest/api/2/issue/createmeta`);
    }


    /// JIRA SOFTWARE

    getBoardConfiguration(boardId: number): Promise<Jira.BoardConfiguration> {
        return this.api.get(`/rest/agile/1.0/board/${boardId}/configuration`)
    }

    getIssuesForBoard(boardId: number, query?: {
        expand?: string,
        fields?: string,
        jql?: string,
        maxResults?: number,
        startAt?: number,
        validateQuery?: boolean
    }): Promise<Array<Jira.Issue>> {
        return this.api.get(`/rest/agile/1.0/board/${boardId}/issue?${stringify(query)}`)
    }

    getBacklogIssuesForBoard(boardId: number, query?: {
        expand?: string,
        fields?: string,
        jql?: string,
        maxResults?: number,
        startAt?: number,
        validateQuery?: boolean
    }): Promise<Array<Jira.Issue>> {
        return this.api.get(`/rest/agile/1.0/board/${boardId}/backlog?${stringify(query)}`)
    }

    getBoardSprints(boardId: number, query?: {
        maxResults?: number,
        startAt?: number,
        state?: string,
    }): Promise<Jira.SprintQuery> {
        return this.api.get(`/rest/agile/1.0/board/${boardId}/sprint?${stringify(query)}`)
    }
}
