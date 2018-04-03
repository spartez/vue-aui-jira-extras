var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Copyright Joyent, Inc. and other Node contributors.

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var decode = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

// Copyright Joyent, Inc. and other Node contributors.

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

var encode = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var querystring = createCommonjsModule(function (module, exports) {

exports.decode = exports.parse = decode;
exports.encode = exports.stringify = encode;
});
var querystring_1 = querystring.decode;
var querystring_2 = querystring.parse;
var querystring_3 = querystring.encode;
var querystring_4 = querystring.stringify;

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var JiraCloudApi = function () {
    function JiraCloudApi() {
        classCallCheck(this, JiraCloudApi);

        this.isMock = false;
    }

    createClass(JiraCloudApi, [{
        key: "ajax",
        value: function ajax(options) {
            return new Promise(function (resolve, reject) {
                var defaultOptions = {
                    success: function success(response) {
                        resolve(response ? JSON.parse(response) : undefined);
                    },
                    error: function error(_error) {
                        reject(_error);
                    }
                };
                var finalOptions = Object.assign(defaultOptions, options);
                window.AP.request(finalOptions);
            });
        }
    }, {
        key: "get",
        value: function get$$1(url) {
            return this.ajax({ url: url });
        }
    }, {
        key: "post",
        value: function post(url, body) {
            return this.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(body)
            });
        }
    }, {
        key: "put",
        value: function put(url, body) {
            return this.ajax({
                type: "PUT",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(body)
            });
        }
    }, {
        key: "del",
        value: function del(url) {
            return this.ajax({
                type: "DELETE",
                url: url
            });
        }
    }]);
    return JiraCloudApi;
}();

var JiraServerApi = function () {
    function JiraServerApi() {
        classCallCheck(this, JiraServerApi);

        this.isMock = false;
        this.contextPath = window.top.AJS.contextPath && window.top.AJS.contextPath();
        this.baseUrl = window.top.location.origin + this.contextPath;
    }

    createClass(JiraServerApi, [{
        key: "ajax",
        value: function ajax(options) {
            var actualOptions = Object.assign({}, options, {
                url: this.baseUrl + options.url
            });
            // TODO get rid of jquery ajax here
            return new Promise(function (resolve, reject) {
                window.AJS.$.ajax(actualOptions).done(resolve).fail(reject);
            });
        }
    }, {
        key: "get",
        value: function get$$1(url) {
            return this.ajax({
                url: url,
                dataType: "json"
            });
        }
    }, {
        key: "del",
        value: function del(url) {
            return this.ajax({
                type: "DELETE",
                url: url
            });
        }
    }, {
        key: "post",
        value: function post(url, body) {
            return this.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(body)
            });
        }
    }, {
        key: "put",
        value: function put(url, body) {
            return this.ajax({
                type: "PUT",
                url: url,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(body),
                dataFilter: function dataFilter(data, type) {
                    return type === "json" && data === "" ? null : data;
                }
            });
        }
    }]);
    return JiraServerApi;
}();

var groups = {
    "header": "Showing 10 of 10 matching groups",
    "total": 10,
    "groups": [{
        "name": "administrators",
        "html": "administrators",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }]
    }, {
        "name": "atlassian-addons-admin",
        "html": "atlassian-addons-admin",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }]
    }, {
        "name": "confluence-administrators",
        "html": "confluence-administrators",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }]
    }, {
        "name": "confluence-users",
        "html": "confluence-users",
        "labels": []
    }, {
        "name": "jira-administrators",
        "html": "jira-administrators",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }]
    }, {
        "name": "jira-core-users",
        "html": "jira-core-users",
        "labels": [{
            "text": "JIRA Core",
            "title": "Users added to this group will be given access to <strong>JIRA Core</strong>",
            "type": "SINGLE"
        }]
    }, {
        "name": "jira-servicedesk-users",
        "html": "jira-servicedesk-users",
        "labels": [{
            "text": "Jira Service Desk",
            "title": "Users added to this group will be given access to <strong>Jira Service Desk</strong>",
            "type": "SINGLE"
        }]
    }, {
        "name": "jira-software-users",
        "html": "jira-software-users",
        "labels": [{
            "text": "JIRA Software",
            "title": "Users added to this group will be given access to <strong>JIRA Software</strong>",
            "type": "SINGLE"
        }]
    }, {
        "name": "site-admins",
        "html": "site-admins",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }, {
            "text": "Multi-App-Access",
            "title": "Users added to this group will be given access to <strong>Jira Service Desk</strong>, <strong>JIRA Software</strong> and <strong>JIRA Core</strong>",
            "type": "MULTIPLE"
        }]
    }, {
        "name": "system-administrators",
        "html": "system-administrators",
        "labels": [{
            "text": "Admin",
            "title": "Users added to this group will be given administrative access",
            "type": "ADMIN"
        }]
    }]
};

var issueCreateMeta = {
    "expand": "projects",
    "projects": [{
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10706",
        "id": "10706",
        "key": "AG",
        "name": "Agility",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10706&avatarId=10847",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10706&avatarId=10847",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10706&avatarId=10847",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10706&avatarId=10847"
        },
        "issuetypes": [{
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10001",
            "id": "10001",
            "description": "A task that needs to be done.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
            "name": "Task",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10004",
            "id": "10004",
            "description": "A big user story that needs to be broken down. Created by JIRA Software - do not edit or delete.",
            "iconUrl": "https://dskrodzki.atlassian.net/images/icons/issuetypes/epic.svg",
            "name": "Epic",
            "subtask": false
        }]
    }, {
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10705",
        "id": "10705",
        "key": "A2",
        "name": "Agility 2",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10705&avatarId=10846",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10705&avatarId=10846",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10705&avatarId=10846",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10705&avatarId=10846"
        },
        "issuetypes": [{
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10001",
            "id": "10001",
            "description": "A task that needs to be done.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
            "name": "Task",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10002",
            "id": "10002",
            "description": "The sub-task of the issue",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10316&avatarType=issuetype",
            "name": "Sub-task",
            "subtask": true
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10000",
            "id": "10000",
            "description": "A user story. Created by JIRA Software - do not edit or delete.",
            "iconUrl": "https://dskrodzki.atlassian.net/images/icons/issuetypes/story.svg",
            "name": "Story",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10003",
            "id": "10003",
            "description": "A problem which impairs or prevents the functions of the product.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype",
            "name": "Bug",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10004",
            "id": "10004",
            "description": "A big user story that needs to be broken down. Created by JIRA Software - do not edit or delete.",
            "iconUrl": "https://dskrodzki.atlassian.net/images/icons/issuetypes/epic.svg",
            "name": "Epic",
            "subtask": false
        }]
    }, {
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10704",
        "id": "10704",
        "key": "AB",
        "name": "Agility Board",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10704&avatarId=10846",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10704&avatarId=10846",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10704&avatarId=10846",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10704&avatarId=10846"
        },
        "issuetypes": [{
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10001",
            "id": "10001",
            "description": "A task that needs to be done.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
            "name": "Task",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10004",
            "id": "10004",
            "description": "A big user story that needs to be broken down. Created by JIRA Software - do not edit or delete.",
            "iconUrl": "https://dskrodzki.atlassian.net/images/icons/issuetypes/epic.svg",
            "name": "Epic",
            "subtask": false
        }]
    }, {
        "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10651",
        "id": "10651",
        "key": "MOLEST65",
        "name": "Awesome Granite Fish",
        "avatarUrls": {
            "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10651&avatarId=10846",
            "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10651&avatarId=10846",
            "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10651&avatarId=10846",
            "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10651&avatarId=10846"
        },
        "issuetypes": [{
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10100",
            "id": "10100",
            "description": "An improvement or enhancement to an existing feature or task.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10310&avatarType=issuetype",
            "name": "Improvement",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10001",
            "id": "10001",
            "description": "A task that needs to be done.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype",
            "name": "Task",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10002",
            "id": "10002",
            "description": "The sub-task of the issue",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10316&avatarType=issuetype",
            "name": "Sub-task",
            "subtask": true
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10101",
            "id": "10101",
            "description": "A new feature of the product, which has yet to be developed.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10311&avatarType=issuetype",
            "name": "New Feature",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10003",
            "id": "10003",
            "description": "A problem which impairs or prevents the functions of the product.",
            "iconUrl": "https://dskrodzki.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype",
            "name": "Bug",
            "subtask": false
        }, {
            "self": "https://dskrodzki.atlassian.net/rest/api/2/issuetype/10004",
            "id": "10004",
            "description": "A big user story that needs to be broken down. Created by JIRA Software - do not edit or delete.",
            "iconUrl": "https://dskrodzki.atlassian.net/images/icons/issuetypes/epic.svg",
            "name": "Epic",
            "subtask": false
        }]
    }]
};

var projects = [{
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10706",
    "id": "10706",
    "key": "AG",
    "name": "Agility",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10706&avatarId=10847",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10706&avatarId=10847",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10706&avatarId=10847",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10706&avatarId=10847"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10705",
    "id": "10705",
    "key": "A2",
    "name": "Agility 2",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10705&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10705&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10705&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10705&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10704",
    "id": "10704",
    "key": "AB",
    "name": "Agility Board",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10704&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10704&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10704&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10704&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10651",
    "id": "10651",
    "key": "MOLEST65",
    "name": "Awesome Granite Fish",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10651&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10651&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10651&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10651&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12405",
    "id": "12405",
    "key": "ACDC",
    "name": "Agile Cards",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12405&avatarId=11548",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12405&avatarId=11548",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12405&avatarId=11548",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12405&avatarId=11548"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/11201",
    "id": "11201",
    "key": "AP",
    "name": "Agile Poker",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=11201&avatarId=11546",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=11201&avatarId=11546",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=11201&avatarId=11546",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=11201&avatarId=11546"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12400",
    "id": "12400",
    "key": "AR",
    "name": "Agile Retros",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12400&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12400&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12400&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12400&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/11600",
    "id": "11600",
    "key": "BD",
    "name": "Business Demo",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=11600&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=11600&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=11600&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=11600&avatarId=11551"
    },
    "projectTypeKey": "business",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12406",
    "id": "12406",
    "key": "CR",
    "name": "Canned Responses",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12406&avatarId=11550",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12406&avatarId=11550",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12406&avatarId=11550",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12406&avatarId=11550"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/11801",
    "id": "11801",
    "key": "COR",
    "name": "CoreProject",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=11801&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=11801&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=11801&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=11801&avatarId=11551"
    },
    "projectTypeKey": "business",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/10000",
    "id": "10000",
    "key": "DEMO",
    "name": "Demonstration Project",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=10000&avatarId=10300",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=10300",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=10300",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=10300"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/10700",
    "id": "10700",
    "key": "ES",
    "name": "Estimation Sample",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=10700&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=10700&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=10700&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=10700&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/11500",
    "id": "11500",
    "key": "IT",
    "name": "IT Desk",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=11500&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=11500&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=11500&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=11500&avatarId=11551"
    },
    "projectTypeKey": "service_desk",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/10400",
    "id": "10400",
    "key": "KRY",
    "name": "Kry-test1",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=10400&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=10400&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=10400&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=10400&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12402",
    "id": "12402",
    "key": "LIM",
    "name": "Limbo",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12402&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12402&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12402&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12402&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/11900",
    "id": "11900",
    "key": "MEET",
    "name": "MeetJS Board",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=11900&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=11900&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=11900&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=11900&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12000",
    "id": "12000",
    "key": "SKP",
    "name": "Sample Kanban Project",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12000&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12000&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12000&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12000&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/10501",
    "id": "10501",
    "key": "SSP",
    "name": "Sample Scrum Project",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=10501&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=10501&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=10501&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=10501&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12105",
    "id": "12105",
    "key": "SHIP",
    "name": "ShipIt",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12105&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12105&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12105&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12105&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/10900",
    "id": "10900",
    "key": "SPG",
    "name": "SPG",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=10900&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=10900&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=10900&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=10900&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://spartez.atlassian.net/rest/api/2/project/12403",
    "id": "12403",
    "key": "TFS",
    "name": "TFS4JIRA",
    "avatarUrls": {
        "48x48": "https://spartez.atlassian.net/secure/projectavatar?pid=12403&avatarId=11551",
        "24x24": "https://spartez.atlassian.net/secure/projectavatar?size=small&pid=12403&avatarId=11551",
        "16x16": "https://spartez.atlassian.net/secure/projectavatar?size=xsmall&pid=12403&avatarId=11551",
        "32x32": "https://spartez.atlassian.net/secure/projectavatar?size=medium&pid=12403&avatarId=11551"
    },
    "projectTypeKey": "software",
    "simplified": false
}];

var users = [{
    "self": "http://squad75:8075/rest/api/2/user?username=jevans-sd-demo",
    "key": "jevans-sd-demo",
    "name": "jevans-sd-demo",
    "emailAddress": "jevans-sd-demo@example.com",
    "avatarUrls": {
        "48x48": "http://www.gravatar.com/avatar/019353b5fd6b245699e8c8b9013bef16?d=mm&s=48",
        "24x24": "http://www.gravatar.com/avatar/019353b5fd6b245699e8c8b9013bef16?d=mm&s=24",
        "16x16": "http://www.gravatar.com/avatar/019353b5fd6b245699e8c8b9013bef16?d=mm&s=16",
        "32x32": "http://www.gravatar.com/avatar/019353b5fd6b245699e8c8b9013bef16?d=mm&s=32"
    },
    "displayName": "Jennifer Evans",
    "active": true,
    "timeZone": "Etc/UTC"
}, {
    "self": "https://dskrodzki.atlassian.net/rest/api/2/user?username=mdavis-sd-demo",
    "key": "mdavis-sd-demo",
    "name": "mdavis-sd-demo",
    "emailAddress": "davis@example.com",
    "avatarUrls": {
        "16x16": "https://randomuser.me/api/portraits/men/78.jpg",
        "24x24": "https://randomuser.me/api/portraits/men/78.jpg",
        "32x32": "https://randomuser.me/api/portraits/men/78.jpg",
        "48x48": "https://randomuser.me/api/portraits/men/78.jpg"
    },
    "displayName": "Gawel Mazur",
    "active": true,
    "timeZone": "Europe/Berlin",
    "locale": "en_US"
}, {
    "self": "https://dskrodzki.atlassian.net/rest/api/2/user?username=admin1",
    "key": "admin",
    "name": "admin1",
    "emailAddress": "admin@example.com",
    "avatarUrls": {
        "16x16": "https://avatar-cdn.atlassian.com/505f80d4c04f00b9ab7047ede1920e70?s=16&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2F505f80d4c04f00b9ab7047ede1920e70%3Fd%3Dmm%26s%3D16%26noRedirect%3Dtrue",
        "24x24": "https://avatar-cdn.atlassian.com/505f80d4c04f00b9ab7047ede1920e70?s=24&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2F505f80d4c04f00b9ab7047ede1920e70%3Fd%3Dmm%26s%3D24%26noRedirect%3Dtrue",
        "32x32": "https://avatar-cdn.atlassian.com/505f80d4c04f00b9ab7047ede1920e70?s=32&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2F505f80d4c04f00b9ab7047ede1920e70%3Fd%3Dmm%26s%3D32%26noRedirect%3Dtrue",
        "48x48": "https://avatar-cdn.atlassian.com/505f80d4c04f00b9ab7047ede1920e70?s=48&d=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2F505f80d4c04f00b9ab7047ede1920e70%3Fd%3Dmm%26s%3D48%26noRedirect%3Dtrue"
    },
    "displayName": "Damian Skrodzki",
    "active": true,
    "timeZone": "Europe/Berlin",
    "locale": "en_US"
}, {
    "self": "https://dskrodzki.atlassian.net/rest/api/2/user?username=agrant-sd-demo",
    "key": "agrant-sd-demo",
    "name": "agrant-sd-demo",
    "emailAddress": "agrant-sd-demo@example.com",
    "avatarUrls": {
        "16x16": "https://randomuser.me/api/portraits/women/93.jpg",
        "24x24": "https://randomuser.me/api/portraits/women/93.jpg",
        "32x32": "https://randomuser.me/api/portraits/women/93.jpg",
        "48x48": "https://randomuser.me/api/portraits/women/93.jpg"
    },
    "displayName": "Alana Grant",
    "active": true,
    "timeZone": "Europe/Berlin",
    "locale": "en_US"
}];

var answerDelay = 200;
function response(response) {
    return new Promise(function (resolve) {
        return setTimeout(function () {
            return resolve(response);
        }, answerDelay);
    });
}
var isMock = true;
function get$1(url) {
    console.log('GET ' + url);
    return new Promise(function (resolve) {
        return resolve([]);
    });
}
function del(url) {
    console.log('DELETE ' + url);
    return new Promise(function (resolve) {
        return resolve([]);
    });
}
function put(url) {
    console.log('PUT ' + url);
    return new Promise(function (resolve) {
        return resolve([]);
    });
}
function post(url) {
    console.log('POST ' + url);
    return new Promise(function (resolve) {
        return resolve([]);
    });
}
var getGroupsForPicker = function getGroupsForPicker(query) {
    return response(Object.assign({}, groups, { groups: groups.groups.filter(function (group) {
            return group.name.indexOf(query) >= 0;
        }) }));
};
var getProject = function getProject(projectKeyOrId) {
    return response(projects.filter(function (project) {
        return project.id === projectKeyOrId;
    })[0]);
};
var getProjects = function getProjects() {
    return response(projects);
};
var getUser = function getUser(userKey) {
    return response(users.filter(function (user) {
        return user.key === userKey;
    })[0]);
};
var getUsers = function getUsers(userQuery) {
    return response(users.filter(function (user) {
        return queryMatchesUser(userQuery, user);
    }));
};
function queryMatchesUser(query, user) {
    return user.key.toUpperCase().indexOf(query.toUpperCase()) >= 0 || user.name.toUpperCase().indexOf(query.toUpperCase()) >= 0 || user.displayName.toUpperCase().indexOf(query.toUpperCase()) >= 0;
}
var getIssueCreateMeta = function getIssueCreateMeta() {
    return response(issueCreateMeta);
};

var JiraMocksApi = /*#__PURE__*/Object.freeze({
	isMock: isMock,
	get: get$1,
	del: del,
	put: put,
	post: post,
	getGroupsForPicker: getGroupsForPicker,
	getProject: getProject,
	getProjects: getProjects,
	getUser: getUser,
	getUsers: getUsers,
	getIssueCreateMeta: getIssueCreateMeta
});

function detectApi() {
    if (window.AP && window.AP.jira && window.AP.user) {
        return new JiraCloudApi();
    } else if (window.top.JIRA && window.top.JIRA.Ajax) {
        // It's important that window.top line above is not executed on Cloud as it throws cross domain error there.
        return new JiraServerApi();
    }
    return JiraMocksApi;
}
// Ultimately, move to jira-js-client npm package or similar

var JiraApi = function () {
    function JiraApi() {
        classCallCheck(this, JiraApi);

        this.api = detectApi();
    }
    // App properties API


    createClass(JiraApi, [{
        key: 'getAppProperties',
        value: function getAppProperties(addonKey) {
            return this.api.get('rest/atlassian-connect/1/addons/' + addonKey + '/properties');
        }
    }, {
        key: 'getAppProperty',
        value: function getAppProperty(addonKey, propertyKey) {
            return this.api.get('rest/atlassian-connect/1/addons/' + addonKey + '/properties/' + propertyKey);
        }
    }, {
        key: 'setAppProperty',
        value: function setAppProperty(addonKey, propertyKey, body) {
            return this.api.put('rest/atlassian-connect/1/addons/' + addonKey + '/properties/' + propertyKey, body);
        }
    }, {
        key: 'deleteAppProperty',
        value: function deleteAppProperty(addonKey, propertyKey) {
            return this.api.del('rest/atlassian-connect/1/addons/' + addonKey + '/properties/' + propertyKey);
        }
        // Jira API

    }, {
        key: 'getApplicationProperty',
        value: function getApplicationProperty(query) {
            return this.api.get('/rest/api/2/application-properties?' + querystring_4(query));
        }
    }, {
        key: 'setApplicationProperty',
        value: function setApplicationProperty(id, body) {
            return this.api.put('/rest/api/2/application-properties/' + id, body);
        }
    }, {
        key: 'getAdvancedSettings',
        value: function getAdvancedSettings() {
            return this.api.get('/rest/api/2/application-properties/advanced-settings');
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            return this.api.get('/rest/api/2/field');
        }
    }, {
        key: 'getIssue',
        value: function getIssue(issueIdOrKey, query) {
            return this.api.get('/rest/api/2/issue/' + issueIdOrKey + '?' + querystring_4(query));
        }
    }, {
        key: 'getIssuePropertyKeys',
        value: function getIssuePropertyKeys(issueIdOrKey) {
            return this.api.get('/rest/api/2/issue/' + issueIdOrKey + '/properties');
        }
    }, {
        key: 'getIssueProperty',
        value: function getIssueProperty(issueIdOrKey, propertyKey) {
            return this.api.get('/rest/api/2/issue/' + issueIdOrKey + '/properties/' + propertyKey);
        }
    }, {
        key: 'setIssueProperty',
        value: function setIssueProperty(issueIdOrKey, propertyKey, body) {
            return this.api.put('/rest/api/2/issue/' + issueIdOrKey + '/properties/' + propertyKey, body);
        }
    }, {
        key: 'deleteIssueProperty',
        value: function deleteIssueProperty(issueIdOrKey, propertyKey) {
            return this.api.del('/rest/api/2/issue/' + issueIdOrKey + '/properties/' + propertyKey);
        }
    }, {
        key: 'getCurrentUser',
        value: function getCurrentUser(query) {
            return this.api.isMock ? getUser('admin') : this.api.get('/rest/api/2/myself?' + querystring_4(query));
        }
    }, {
        key: 'getProject',
        value: function getProject$$1(projectKeyOrId, query) {
            return this.api.isMock ? getProject(projectKeyOrId) : this.api.get('/rest/api/2/project/' + projectKeyOrId + '?' + querystring_4(query));
        }
    }, {
        key: 'getProjects',
        value: function getProjects$$1(query) {
            return this.api.isMock ? getProjects() : this.api.get('/rest/api/2/project?' + querystring_4(query));
        }
    }, {
        key: 'getProjectPropertyKeys',
        value: function getProjectPropertyKeys(projectIdOrKey) {
            return this.api.get('/rest/api/2/project/' + projectIdOrKey + '/properties');
        }
    }, {
        key: 'getProjectProperty',
        value: function getProjectProperty(projectIdOrKey, propertyKey) {
            return this.api.get('/rest/api/2/project/' + projectIdOrKey + '/properties/' + propertyKey);
        }
    }, {
        key: 'setProjectProperty',
        value: function setProjectProperty(projectIdOrKey, propertyKey, body) {
            return this.api.put('/rest/api/2/project/' + projectIdOrKey + '/properties/' + propertyKey, body);
        }
    }, {
        key: 'deleteProjectProperty',
        value: function deleteProjectProperty(projectIdOrKey, propertyKey) {
            return this.api.del('/rest/api/2/project/' + projectIdOrKey + '/properties/' + propertyKey);
        }
    }, {
        key: 'getUserPropertyKeys',
        value: function getUserPropertyKeys(query) {
            return this.api.get('/rest/api/2/user/properties?' + querystring_4(query));
        }
    }, {
        key: 'getUserProperty',
        value: function getUserProperty(propertyKey, query) {
            return this.api.get('/rest/api/2/user/properties/' + propertyKey + '?' + querystring_4(query));
        }
    }, {
        key: 'setUserProperty',
        value: function setUserProperty(propertyKey, query, body) {
            return this.api.put('/rest/api/2/user/properties/' + propertyKey + '?' + querystring_4(query), body);
        }
    }, {
        key: 'deleteUserProperty',
        value: function deleteUserProperty(propertyKey, query) {
            return this.api.del('/rest/api/2/user/properties/' + propertyKey + '?' + querystring_4(query));
        }
    }, {
        key: 'getUser',
        value: function getUser$$1(userKey) {
            return this.api.isMock ? getUser(userKey) : this.api.get('/rest/api/2/user?key=' + userKey);
        }
    }, {
        key: 'getUsers',
        value: function getUsers$$1(username) {
            return this.api.isMock ? getUsers(username) : this.api.get('/rest/api/2/user/search?username=' + username);
        }
    }, {
        key: 'getGroupsForPicker',
        value: function getGroupsForPicker$$1(query) {
            return this.api.isMock ? getGroupsForPicker(query.query) : this.api.get('/rest/api/2/groups/picker?' + querystring_4(query));
        }
    }, {
        key: 'getIssueCreateMeta',
        value: function getIssueCreateMeta$$1() {
            return this.api.isMock ? getIssueCreateMeta() : this.api.get('/rest/api/2/issue/createmeta');
        }
    }]);
    return JiraApi;
}();

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = _mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$2(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$2;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_1(collection)) {
      var iteratee = _baseIteratee(predicate, 3);
      collection = keys_1(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

var _createFind = createFind;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return _baseFindIndex(array, _baseIteratee(predicate, 3), index);
}

var findIndex_1 = findIndex;

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = _createFind(findIndex_1);

var find_1 = find;

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " .result-project[data-v-f2ac1cf2] { align-items: center; display: flex; padding: 3px 2px; } .result-project-avatar[data-v-f2ac1cf2] { margin-right: 5px; } .result-project-name[data-v-f2ac1cf2] { text-overflow: ellipsis; overflow: hidden; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();
// TODO add recently accessed section

var ProjectPicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('va-select2', { attrs: { "allow-clear": _vm.allowClear, "disabled": _vm.disabled, "init-selection": _vm.initialValue, "locked": _vm.locked, "multiple": _vm.multiple, "placeholder": _vm.placeholder, "query": _vm.queryValues, "value": _vm.value }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } }, scopedSlots: _vm._u([{ key: "formatSelection", fn: function fn(option) {
                    return _c('span', {}, [_c('aui-avatar', { attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" " + _vm._s(option.data.name) + " ")], 1);
                } }, { key: "formatResult", fn: function fn(option) {
                    return _c('span', { staticClass: "result-project" }, [_c('aui-avatar', { staticClass: "result-project-avatar", attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" "), _c('span', { staticClass: "result-project-name" }, [_vm._v(_vm._s(option.data.name))])], 1);
                } }]) });
    }, staticRenderFns: [], _scopeId: 'data-v-f2ac1cf2',
    props: {
        allowClear: Boolean,
        disabled: Boolean,
        locked: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        multiple: Boolean,
        placeholder: String,
        value: [String, Array]
    },

    created: function created() {
        this.getProjectsPromise = this.$jira.getProjects();
    },


    methods: {
        mapProjectToProjectOption: function mapProjectToProjectOption(project) {
            return {
                id: project.id,
                text: project.name + ' (' + project.key + ')',
                data: project
            };
        },
        queryValues: function queryValues(query) {
            var _this = this;

            if (query.term === undefined) {} else {
                this.getProjectsPromise.then(function (projects) {
                    var projectItems = projects.filter(function (project) {
                        return project.key === query.term.toUpperCase() || project.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0;
                    }).map(function (project) {
                        return _this.mapProjectToProjectOption(project);
                    });
                    query.callback({ results: projectItems });
                });
            }
        },
        initialValue: function initialValue(element, callback) {
            var _this2 = this;

            if (this.multiple) {
                if (element.val()) {
                    var projectIds = element.val().split(',');
                    this.getProjectsPromise.then(function (projects) {
                        var projectItems = projectIds.map(function (projectId) {
                            return find_1(projects, { id: projectId });
                        }).map(function (project) {
                            return _this2.mapProjectToProjectOption(project);
                        });
                        callback(projectItems);
                    });
                } else {
                    callback([]);
                }
            } else {
                if (element.val()) {
                    this.$jira.getProject(element.val()).then(function (project) {
                        callback(_this2.mapProjectToProjectOption(project));
                    });
                }
            }
        }
    }
};

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " .result-user[data-v-e5241c2e] { align-items: center; display: flex; padding: 3px 2px; } .result-user-avatar[data-v-e5241c2e] { margin-right: 15px; } .result-user-text[data-v-e5241c2e] { display: flex; flex-direction: column; overflow: hidden; } .result-user-name[data-v-e5241c2e], .result-user-fullname[data-v-e5241c2e] { overflow: hidden; text-overflow: ellipsis; } .result-user-name[data-v-e5241c2e] { font-size: 12px; font-weight: 600; color: #8993A4; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var UserPicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('va-select2', { ref: "select", attrs: { "allow-clear": _vm.allowClear, "disabled": _vm.disabled, "init-selection": _vm.initialValue, "locked": _vm.locked, "multiple": _vm.multiple, "placeholder": _vm.placeholder, "query": _vm.queryValues, "value": _vm.value }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } }, scopedSlots: _vm._u([{ key: "formatSelection", fn: function fn(option) {
                    return _c('span', {}, [_c('aui-avatar', { attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" " + _vm._s(option.data.displayName) + " ")], 1);
                } }, { key: "formatResult", fn: function fn(option) {
                    return _c('span', { staticClass: "result-user" }, [_c('aui-avatar', { staticClass: "result-user-avatar", attrs: { "size": "medium", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" "), _c('div', { staticClass: "result-user-text" }, [_c('span', { staticClass: "result-user-fullname" }, [_vm._v(_vm._s(option.data.displayName))]), _vm._v(" "), _c('span', { staticClass: "result-user-name" }, [_vm._v("@" + _vm._s(option.data.name))])])], 1);
                } }]) });
    }, staticRenderFns: [], _scopeId: 'data-v-e5241c2e',
    props: {
        allowClear: Boolean,
        disabled: Boolean,
        locked: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        multiple: Boolean,
        placeholder: String,
        value: [String, Array]
    },

    data: function data() {
        return { myself: undefined };
    },
    created: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this.$jira.getCurrentUser();

                        case 2:
                            this.myself = _context.sent;

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function created() {
            return _ref.apply(this, arguments);
        }

        return created;
    }(),


    methods: {
        mapUserToOption: function mapUserToOption(user) {
            return {
                id: user.key,
                data: user
            };
        },
        queryValues: function queryValues(query) {
            var _this = this;

            if (query.term === undefined) {} else {
                var showMyselfOnTop = this.myself && query.term === '';

                if (showMyselfOnTop) {
                    query.callback({ results: [this.mapUserToOption(this.myself)] });
                }

                this.$jira.getUsers(query.term).then(function (users) {
                    var usersForPicker = showMyselfOnTop ? [_this.myself].concat(toConsumableArray(users.filter(function (user) {
                        return user.key !== _this.myself.key;
                    }))) : users;

                    var userItems = usersForPicker.map(function (user) {
                        return _this.mapUserToOption(user);
                    });
                    query.callback({ results: userItems });
                });
            }
        },
        initialValue: function initialValue(element, callback) {
            var _this2 = this;

            if (this.multiple) {
                if (element.val()) {
                    var userKeys = element.val().split(',');

                    Promise.all(userKeys.map(function (userKey) {
                        return _this2.$jira.getUser(userKey);
                    })).then(function (users) {
                        var userItems = users.filter(function (user) {
                            return user;
                        }).map(function (user) {
                            return _this2.mapUserToOption(user);
                        });
                        callback(userItems);
                    });
                } else {
                    callback([]);
                }
            } else {
                if (element.val()) {
                    this.$jira.getUser(element.val()).then(function (user) {
                        return callback(_this2.mapUserToOption(user));
                    });
                }
            }
        }
    }
};

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " .result-issuetype[data-v-7d730ba1] { align-items: center; display: flex; } .result-issuetype-name[data-v-7d730ba1] { overflow: hidden; text-overflow: ellipsis; padding: 4px; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var IssueTypePicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('va-select2', { ref: "select", attrs: { "multiple": _vm.multiple, "allow-clear": _vm.allowClear, "disabled": _vm.disabled, "init-selection": _vm.initSelection, "locked": _vm.locked, "minimum-results-for-search": 5, "placeholder": _vm.placeholder, "query": _vm.query, "value": _vm.value }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } }, scopedSlots: _vm._u([{ key: "formatSelection", fn: function fn(option) {
                    return _c('span', {}, [_c('aui-avatar', { attrs: { "squared": "", "size": "xsmall", "src": option.data.iconUrl } }), _vm._v(" " + _vm._s(option.data.name) + " ")], 1);
                } }, { key: "formatResult", fn: function fn(option) {
                    return _c('span', { staticClass: "result-issuetype" }, [_c('aui-avatar', { staticClass: "result-issuetype-avatar", attrs: { "size": "xsmall", "src": option.data.iconUrl } }), _vm._v(" "), _c('span', { staticClass: "result-issuetype-name" }, [_vm._v(_vm._s(option.data.name))])], 1);
                } }]) });
    }, staticRenderFns: [], _scopeId: 'data-v-7d730ba1',
    props: {
        allowClear: Boolean,
        disabled: Boolean,
        locked: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        multiple: Boolean,
        nonSubtasks: {
            type: Boolean,
            default: true
        },
        placeholder: String,
        projectId: String,
        subtasks: {
            type: Boolean,
            default: true
        },
        value: [String, Array]
    },

    watch: {
        projectId: function projectId() {
            this.updateOptions();
        },
        subtasks: function subtasks() {
            this.updateOptions();
        },
        nonSubtasks: function nonSubtasks() {
            this.updateOptions();
        }
    },

    beforeCreate: function beforeCreate() {
        this.getIssueCreateMetaPromise = this.$jira.getIssueCreateMeta();
    },
    created: function created() {
        this.updateOptions();
    },


    methods: {
        mapIssueTypeToOption: function mapIssueTypeToOption(issueType) {
            return {
                id: issueType.id,
                text: issueType.name,
                data: issueType
            };
        },
        query: function query(_query) {
            var _this = this;

            if (_query.term === undefined) {} else {
                this.getIssueTypes.then(function (issueTypes) {
                    _query.callback({
                        results: issueTypes.filter(function (issueType) {
                            return issueType.name.toUpperCase().indexOf(_query.term.toUpperCase()) >= 0;
                        }).map(function (issueType) {
                            return _this.mapIssueTypeToOption(issueType);
                        })
                    });
                });
            }
        },
        initSelection: function initSelection(element, callback) {
            var _this2 = this;

            if (this.multiple) {
                if (element.val()) {
                    var issueTypeIds = element.val().split(',');
                    this.getIssueTypes.then(function (issueTypes) {
                        var issueTypeOptions = issueTypeIds.map(function (issueTypeId) {
                            return issueTypes.find(function (issueType) {
                                return issueType.id === issueTypeId;
                            });
                        }).filter(function (issueType) {
                            return issueType;
                        }).map(function (issueType) {
                            return _this2.mapIssueTypeToOption(issueType);
                        });
                        callback(issueTypeOptions);
                    });
                } else {
                    callback([]);
                }
            } else {
                if (element.val()) {
                    this.getIssueTypes.then(function (issueTypes) {
                        var issueType = issueTypes.find(function (issueType) {
                            return issueType.id === element.val();
                        });
                        if (issueType) {
                            callback(_this2.mapIssueTypeToOption(issueType));
                        }
                    });
                }
            }
        },
        updateOptions: function updateOptions() {
            var _this3 = this;

            this.getIssueTypes = this.getIssueCreateMetaPromise.then(function (issueCreateMeta) {
                var projectIssueTypes = issueCreateMeta.projects.find(function (project) {
                    return project.id === _this3.projectId;
                });
                var filteredIssueTypes = projectIssueTypes ? projectIssueTypes.issuetypes.filter(function (issueType) {
                    return issueType.subtask && _this3.subtasks || !issueType.subtask && _this3.nonSubtasks;
                }) : [];

                var firstIssueTypeId = filteredIssueTypes[0] && filteredIssueTypes[0].id;

                // Autoselect first value in single select
                if (!_this3.value && !_this3.multiple) {
                    _this3.$emit('input', firstIssueTypeId);
                }

                return filteredIssueTypes;
            });
        }
    }

};

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = "";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var GroupsPicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('va-select2', { attrs: { "allow-clear": _vm.allowClear, "disabled": _vm.disabled, "init-selection": _vm.initialMultiValues, "multiple": _vm.multiple, "placeholder": _vm.placeholder, "query": _vm.queryGroups, "value": _vm.value }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } } });
    }, staticRenderFns: [],
    props: {
        allowClear: Boolean,
        disabled: Boolean,
        multiple: Boolean,
        placeholder: { type: String, default: "Select groups..." },
        value: {
            type: [Array, String],
            required: true
        }
    },

    methods: {
        mapGroupToGroupOption: function mapGroupToGroupOption(group) {
            return { id: group, text: group };
        },
        queryGroups: function queryGroups(_ref) {
            var _this = this;

            var term = _ref.term,
                callback = _ref.callback;

            this.$jira.getGroupsForPicker({ query: term }).then(function (groupsResults) {
                callback({ results: groupsResults.groups.map(function (group) {
                        return _this.mapGroupToGroupOption(group.name);
                    }) });
            });
        },
        initialMultiValues: function initialMultiValues(element, callback) {
            var value = element.val();
            if (!this.multiple) {
                if (value) {
                    callback(this.mapGroupToGroupOption(value));
                }
            } else {
                if (value) {
                    var items = value.split(',').map(this.mapGroupToGroupOption);
                    callback(items);
                } else {
                    callback([]);
                }
            }
        }
    }
};

function registerAll(Vue) {
    Vue.component('va-project-picker', ProjectPicker);
    Vue.component('va-user-picker', UserPicker);
    Vue.component('va-issue-type-picker', IssueTypePicker);
    Vue.component('va-group-picker', GroupsPicker);
}

var VueAuiJiraExtrasOptions = function VueAuiJiraExtrasOptions() {
    classCallCheck(this, VueAuiJiraExtrasOptions);
};
var VueAuiJiraExtras = function VueAuiJiraExtras(Vue, options) {
    registerAll(Vue);
    Vue.prototype.$jira = new JiraApi();
};

export default VueAuiJiraExtras;
export { VueAuiJiraExtrasOptions, JiraApi };
