export default class JiraApi {
    private api;
    getProject(projectKeyOrId: string): Promise<object>;
    getProjects(): Promise<Array<object>>;
    getUser(userKey: string): Promise<object>;
    getUsers(username: string): Promise<Array<object>>;
    getGroupsForPicker({query}: {
        query: string;
    }): Promise<object[]>;
    getIssueCreateMeta(): Promise<object>;
}
