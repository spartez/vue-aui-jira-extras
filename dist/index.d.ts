export default class JiraApi {
    private api;
    getProject(projectKeyOrId: string): Promise<Jira.Project>;
    getProjects(): Promise<Array<Jira.Project>>;
    getUser(userKey: string): Promise<Jira.User>;
    getUsers(username: string): Promise<Array<Jira.User>>;
    getGroupsForPicker({query}: {
        query: string;
    }): Promise<any>;
    getIssueCreateMeta(): Promise<object>;
}
