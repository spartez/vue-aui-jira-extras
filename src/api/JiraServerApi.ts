import {JiraApiBase} from "./JiraApiBase";

export default class JiraServerApi implements JiraApiBase {
    isMock = false;

    private contextPath = window.top.AJS.contextPath && window.top.AJS.contextPath();
    private baseUrl = window.top.location.origin + this.contextPath;

    private ajax(options) {
        const actualOptions = Object.assign({}, options, {
            url: this.baseUrl + options.url
        });

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

    post(url, data) {
        return this.ajax({
            type: "POST",
            url,
            contentType: "application/json",
            data: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this.ajax({
            type: "PUT",
            url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
            dataFilter(data, type) {
                return type === "json" && data === "" ? null : data;
            }
        });
    }

    private getPaged(url, dataProperty) {
        const promise = window.AJS.$.Deferred();

        let data = [];
        if (url.indexOf("?") === -1) url += "?";

        const getNextPage = function () {
            return this.ajax({url: url + `&startAt=${data.length}`}).then(function (res) {
                let newData = res[dataProperty];
                promise.notify(newData);

                data = data.concat(newData);
                if (data.length < res["total"] || res["isLast"] === false) {
                    getNextPage()
                } else {
                    promise.resolve(data);
                }
            })
        }

        getNextPage();

        return promise.promise();
    }
}