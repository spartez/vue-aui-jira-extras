export interface JiraApiBase {
    isMock: boolean;
    get(url: string): Promise<any>;
    del(url: string): Promise<any>;
    post(url: string, body: any): Promise<any>;
    put(url: string, body: any): Promise<any>;
}
