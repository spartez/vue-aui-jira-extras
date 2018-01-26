'use strict';

function get() {
    // return AP.request(...)
}

var JiraCloudApi = Object.freeze({
	get: get
});

function get$1() {
    // return AP.request(...)
}

var JiraServerApi = Object.freeze({
	get: get$1
});

const projects = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
];

function get$2(url, payload) {
    let response;
    if (url === '/rest/api/2/project') {
        response = projects;
    } else if (url.match(/\/rest\/api\/2\/project\/\d+/)) {
        const projectId = url.split('/')[url.split('/').length - 1];
        response = projects.filter(project => project.id === projectId)[0];
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(response, 100));
    })
}


var JiraMocksApi = Object.freeze({
	get: get$2
});

function detectApi() {
    if (window.AP && AP.jira && AP.user) {
        return JiraCloudApi;
    } else if (window.JIRA && JIRA.API) {
        return JiraServerApi;
    }
    return JiraMocksApi;
}

let api = detectApi();

function getProjects() {
    return api.get('/rest/api/2/project');
}

function getProject(projectKeyOrId) {
    return api.get(`/rest/api/2/project/${projectKeyOrId}`);
}

var JiraApi = Object.freeze({
	detectApi: detectApi,
	getProjects: getProjects,
	getProject: getProject
});

(function(){ if(typeof document !== 'undefined'){ var head=document.head||document.getElementsByTagName('head')[0], style=document.createElement('style'), css=" .result-project[data-v-48769a5e] { align-items: center; display: flex; padding: 3px 2px; } .result-project-avatar[data-v-48769a5e] { margin-right: 5px; } .result-project-name[data-v-48769a5e] { text-overflow: ellipsis; overflow-y: hidden; } "; style.type='text/css'; if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style); } })();



































// TODO add recently accessed section
// TODO Move to squared avatars (border-radius 3px) and support them in vue-aui

var ProjectPicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.multiple)?_c('aui-select2-single',{attrs:{"value":_vm.value,"placeholder":_vm.placeholder,"query":_vm.queryValues,"init-selection":_vm.initialValue},on:{"input":function($event){_vm.$emit('input', $event);}},scopedSlots:_vm._u([{key:"formatSelection",fn:function(option){return _c('span',{},[_c('aui-avatar',{attrs:{"squared":"","size":"xsmall","src":option.data.avatarUrls['48x48']}}),_vm._v(" "+_vm._s(option.data.name)+" ")],1)}},{key:"formatResult",fn:function(option){return _c('span',{staticClass:"result-project"},[_c('aui-avatar',{staticClass:"result-project-avatar",attrs:{"squared":"","size":"xsmall","src":option.data.avatarUrls['48x48']}}),_vm._v(" "),_c('span',{staticClass:"result-project-name"},[_vm._v(_vm._s(option.data.name))])],1)}}])}):_c('aui-select2-multi',{attrs:{"value":_vm.value,"placeholder":_vm.placeholder,"query":_vm.queryValues,"init-selection":_vm.initialValues},on:{"input":function($event){_vm.$emit('input', $event);}},scopedSlots:_vm._u([{key:"formatSelection",fn:function(option){return _c('span',{},[_c('aui-avatar',{attrs:{"squared":"","size":"xsmall","src":option.data.avatarUrls['48x48']}}),_vm._v(" "+_vm._s(option.data.name)+" ")],1)}},{key:"formatResult",fn:function(option){return _c('span',{staticClass:"result-project"},[_c('aui-avatar',{staticClass:"result-project-avatar",attrs:{"squared":"","size":"xsmall","src":option.data.avatarUrls['48x48']}}),_vm._v(" "),_c('span',{staticClass:"result-project-name"},[_vm._v(_vm._s(option.data.name))])],1)}}])})},staticRenderFns: [],_scopeId: 'data-v-48769a5e',
    props: {
        placeholder: String,
        value: [String, Array],
        multiple: Boolean
    },

    methods: {
        mapProjectToProjectOption(project) {
            return {
                id: project.id,
                text: `${project.name} (${project.key})`,
                data: project
            }
        },

        queryValues(query) {
            if (query.term === undefined) {
            } else {
                this.$jira.getProjects().then(projects => {
                    const projectItems = projects
                        .filter(project => project.key === query.term.toUpperCase() || project.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0)
                        .map(project => this.mapProjectToProjectOption(project));
                    query.callback({results: projectItems});
                });
            }
        },

        initialValue(element, callback) {
            if (element.val()) {
                this.$jira.getProject(element.val()).then(project => {
                    callback(this.mapProjectToProjectOption(project));
                });
            }
        },
        initialValues(element, callback) {
            if (element.val()) {
                const projectIds = element.val().split(',');
                this.$jira.getProjects().then(projects => {
                    const projectItems = projects
                        .filter(project => projectIds.indexOf(project.id) >= 0)
                        .map(project => this.mapProjectToProjectOption(project));
                    callback(projectItems);
                });
            }
        }
    }
}

var vueAuiJiraExtras = {
    install(Vue, options) {
        Vue.component('va-project-picker', ProjectPicker);

        Vue.prototype.$jira = JiraApi;
    }
}

module.exports = vueAuiJiraExtras;
