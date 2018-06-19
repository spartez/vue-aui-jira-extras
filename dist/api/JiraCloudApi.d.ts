import { JiraApiBase } from "./JiraApiBase";
export default class JiraCloudApi implements JiraApiBase {
    isMock: boolean;
    private ajax;
    get(url: any): Promise<{}>;
    post(url: any, body: any): Promise<{}>;
    put(url: any, body: any): Promise<{}>;
    del(url: any): Promise<{}>;
}
