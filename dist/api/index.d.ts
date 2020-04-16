export declare type Platform = 'development' | 'cloud' | 'server';
export declare function getPlatform(): Platform;
export declare type UserKeyOrUsername = {
    userKey?: string;
    username?: string;
};
export default class JiraApi {
    private api;
    getAppProperties(addonKey: string): Promise<Jira.EntityPropertiesKeys>;
    getAppProperty(addonKey: string, propertyKey: string): Promise<Jira.EntityProperty>;
    setAppProperty(addonKey: string, propertyKey: string, body: any): Promise<void>;
    deleteAppProperty(addonKey: string, propertyKey: string): Promise<void>;
    getApplicationProperty(query: {
        key?: string;
        keyFilter?: string;
        permissionLevel?: string;
    }): Promise<Array<Jira.ApplicationProperty>>;
    setApplicationProperty(id: string, body?: {
        id: string;
        value: string;
    }): Promise<Array<Jira.ApplicationProperty>>;
    getAdvancedSettings(): Promise<Array<Jira.ApplicationProperty>>;
    getFields(): Promise<Array<Jira.Field>>;
    getIssue(issueIdOrKey: string, query?: {
        expand: string;
        fields: string;
        fieldsByKeys: boolean;
        properties: string;
        updateHistory: boolean;
    }): Promise<Jira.Issue>;
    getIssuePropertyKeys(issueIdOrKey: string): Promise<Jira.EntityPropertiesKeys>;
    getIssueProperty(issueIdOrKey: string, propertyKey: string): Promise<Jira.EntityProperty>;
    setIssueProperty(issueIdOrKey: string, propertyKey: string, body: any): Promise<void>;
    deleteIssueProperty(issueIdOrKey: string, propertyKey: string): Promise<void>;
    getCurrentUser(query?: {
        expand: string;
    }): Promise<Jira.User>;
    getProject(projectKeyOrId: string, query?: {
        expand: string;
    }): Promise<Jira.Project>;
    getProjects(query?: {
        expand: string;
        recent: number;
    }): Promise<Array<Jira.Project>>;
    getProjectPropertyKeys(projectIdOrKey: string): Promise<Jira.EntityPropertiesKeys>;
    getProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<Jira.EntityProperty>;
    setProjectProperty(projectIdOrKey: string, propertyKey: string, body: any): Promise<void>;
    deleteProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<void>;
    searchIssues(query?: {
        expand?: string;
        fields?: string;
        fieldsByKeys?: boolean;
        jql?: string;
        maxResults?: number;
        properties?: string;
        startAt?: number;
        validateQuery?: boolean;
    }): Promise<Array<Jira.Issue>>;
    getUserPropertyKeys(query: UserKeyOrUsername): Promise<Jira.EntityPropertiesKeys>;
    getUserProperty(propertyKey: string, query: UserKeyOrUsername): Promise<Jira.EntityProperty>;
    setUserProperty(propertyKey: string, query: UserKeyOrUsername, body: any): Promise<void>;
    deleteUserProperty(propertyKey: string, query: UserKeyOrUsername): Promise<void>;
    getUser(userIdentifier: {
        accountId?: string;
        username?: string;
        key?: string;
    }): Promise<Jira.User>;
    getUsers(username: string): Promise<Array<Jira.User>>;
    getGroupsForPicker(query: {
        query: string;
    }): Promise<any>;
    findUsersAndGroups(query: string): Promise<any>;
    getUsersFromGroup(groupname: string): Promise<any>;
    getIssueCreateMeta(): Promise<object>;
    getBoardConfiguration(boardId: number): Promise<Jira.BoardConfiguration>;
    getIssuesForBoard(boardId: number, query?: {
        expand?: string;
        fields?: string;
        jql?: string;
        maxResults?: number;
        startAt?: number;
        validateQuery?: boolean;
    }): Promise<Array<Jira.Issue>>;
    getBacklogIssuesForBoard(boardId: number, query?: {
        expand?: string;
        fields?: string;
        jql?: string;
        maxResults?: number;
        startAt?: number;
        validateQuery?: boolean;
    }): Promise<Array<Jira.Issue>>;
    getBoardSprints(boardId: number, query?: {
        maxResults?: number;
        startAt?: number;
        state?: string;
    }): Promise<Jira.SprintQuery>;
}
