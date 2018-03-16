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
    getIssue(issueIdOrKey: string, query: {
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
    getCurrentUser(query: {
        expand: string;
    }): Promise<Jira.User>;
    getProject(projectKeyOrId: string, query: {
        expand: string;
    }): Promise<Jira.Project>;
    getProjects(query: {
        expand: string;
        recent: number;
    }): Promise<Array<Jira.Project>>;
    getProjectPropertyKeys(projectIdOrKey: string): Promise<Jira.EntityPropertiesKeys>;
    getProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<Jira.EntityProperty>;
    setProjectProperty(projectIdOrKey: string, propertyKey: string, body: any): Promise<void>;
    deleteProjectProperty(projectIdOrKey: string, propertyKey: string): Promise<void>;
    getUserPropertyKeys(query: {
        userKey: string;
    } | {
        username: string;
    }): Promise<Jira.EntityPropertiesKeys>;
    getUserProperty(propertyKey: string, query: {
        userKey: string;
    } | {
        username: string;
    }): Promise<Jira.EntityProperty>;
    setUserProperty(propertyKey: string, query: {
        userKey: string;
    } | {
        username: string;
    }, body: any): Promise<void>;
    deleteUserProperty(propertyKey: string, query: {
        userKey: string;
    } | {
        username: string;
    }): Promise<void>;
    getUser(userKey: string): Promise<Jira.User>;
    getUsers(username: string): Promise<Array<Jira.User>>;
    getGroupsForPicker(query: {
        query: string;
    }): Promise<any>;
    getIssueCreateMeta(): Promise<object>;
}
