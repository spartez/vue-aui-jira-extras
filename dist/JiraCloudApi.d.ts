import { JiraApiBase } from "./JiraApiBase";
export default class JiraCloudApi implements JiraApiBase {
    isMock: boolean;
    private ajax(options);
    get(url: any): Promise<{}>;
    post(url: any, data: any): Promise<{}>;
    put(url: any, data: any): Promise<{}>;
    del(url: any): Promise<{}>;
}
