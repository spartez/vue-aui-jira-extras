import {JiraApiBase} from "./JiraApiBase";

export default class JiraCloudApi implements JiraApiBase {

    isMock = false;

    private ajax(options) {
        return new Promise((resolve, reject) => {
            const defaultOptions = {
                success(response) {
                    resolve(response ? JSON.parse(response) : undefined);
                },

                error(error) {
                    reject(error);
                }
            };
            const finalOptions = Object.assign(defaultOptions, options);

            window.AP.request(finalOptions);
        });
    }

    get(url) {
        return this.ajax({url});
    }

    post(url, body) {
        return this.ajax({
            type: "POST",
            url,
            contentType: "application/json",
            data: JSON.stringify(body)
        });
    }

    put(url, body) {
        return this.ajax({
            type: "PUT",
            url,
            contentType: "application/json",
            data: JSON.stringify(body)
        });
    }

    del(url) {
        return this.ajax({
            type: "DELETE",
            url,
        });
    };
}