export default class JiraApi {
    private api;
    private detectApi();
    getProject(projectKeyOrId: any): Promise<object>;
    getProjects(): Promise<Array<object>>;
    getUser(userKey: any): Promise<object>;
    getUsers(username: any): Promise<Array<object>>;
    getIssueCreateMeta(): Promise<object>;
}
