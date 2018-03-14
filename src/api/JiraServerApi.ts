import {JiraApiBase} from "./JiraApiBase";

export default class JiraServerApi implements JiraApiBase {
    isMock = false;

    private contextPath = window.top.AJS.contextPath && window.top.AJS.contextPath();
    private baseUrl = window.top.location.origin + this.contextPath;

    private ajax(options) {
        const actualOptions = Object.assign({}, options, {
            url: this.baseUrl + options.url
        });

        // TODO get rid of jquery ajax here
        return new Promise((resolve, reject) => {
            window.AJS.$.ajax(actualOptions).done(resolve).fail(reject);
        })
    }

    get(url) {
        return this.ajax({
            url,
            dataType: "json"
        });
    }

    del(url) {
        return this.ajax({
            type: "DELETE",
            url
        });
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
            dataType: "json",
            data: JSON.stringify(body),
            dataFilter(data, type) {
                return type === "json" && data === "" ? null : data;
            }
        });
    }
}