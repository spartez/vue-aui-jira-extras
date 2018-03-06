let contextPath = window.top.AJS.contextPath && window.top.AJS.contextPath();
let baseUrl = window.top.location.origin + contextPath;

export function setUrl(url) {
    baseUrl = url;
}

function ajax(options) {
    const actualOptions = Object.assign({}, options, {
        url: baseUrl + options.url
    });

    return new Promise((resolve, reject) => {
        AJS.$.ajax(actualOptions).done(resolve).fail(reject);
    })
}

export function get(url) {
    return ajax({
        url,
        dataType: "json"
    });
}

export function del(url) {
    return ajax({
        type: "DELETE",
        url
    });
}

export function post(url, data) {
    return ajax({
        type: "POST",
        url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

export function put(url, data) {
    return ajax({
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

function getPaged(url, dataProperty) {
    const promise = AJS.$.Deferred();

    let data = [];
    if (url.indexOf("?") === -1) url += "?";

    function getNextPage() {
        return ajax({url: url + `&startAt=${data.length}`}).then(function (res) {
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