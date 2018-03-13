import { JiraApiBase } from "./JiraApiBase";
export default class JiraServerApi implements JiraApiBase {
    isMock: boolean;
    private contextPath;
    private baseUrl;
    private ajax(options);
    get(url: any): Promise<{}>;
    del(url: any): Promise<{}>;
    post(url: any, data: any): Promise<{}>;
    put(url: any, data: any): Promise<{}>;
    private getPaged(url, dataProperty);
}
