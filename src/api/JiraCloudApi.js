function ajax(options) {
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

        AP.request(finalOptions);
    });
}

export function get(url) {
    return ajax({url});
}

export function post(url, data) {
    return ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

export function put(url, data) {
    return ajax({
        type: "PUT",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}
