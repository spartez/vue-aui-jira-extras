export interface JiraApiBase {
    isMock: boolean;

    get(url: string): Promise<any>;

    del(url: string): Promise<any>;

    post(url: string, data: any): Promise<any>;

    put(url: string, data: any): Promise<any>;
}