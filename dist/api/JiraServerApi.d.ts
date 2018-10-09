import { JiraApiBase } from "./JiraApiBase";
export default class JiraServerApi implements JiraApiBase {
    isMock: boolean;
    private contextPath;
    private baseUrl;
    private ajax;
    get(url: any): Promise<{}>;
    del(url: any): Promise<{}>;
    post(url: any, body: any): Promise<{}>;
    put(url: any, body: any): Promise<{}>;
}
