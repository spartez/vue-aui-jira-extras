# vue-aui-jira-extras

> This library is still in progress.

[![npm version](https://badge.fury.io/js/vue-aui-jira-extras.svg)](https://badge.fury.io/js/vue-aui-jira-extras)

`vue-aui-jira-extras` is an addition to [vue-aui](https://github.com/spartez/vue-aui). It implements various Jira pickers without adding Jira dependency to `vue-aui` library.

Features:

* Works with Jira Server and Cloud
* Automatically detects how to query Jira host
* No manual data feeding - fetches needed data automatically

## Implemented pickers

* [x] Project picker (`va-project-picker`)
* [x] User picker (`va-user-picker`)
* [x] Issue type picker
* [ ] Issue picker
* [ ] Group picker

## Installation

    npm install vue-aui-jira-extras --save-dev
    
After that add this to install library
    
    import VueAuiJira from 'vue-aui-jira-extras'

    Vue.use(VueAuiJira);
    
    
## Customization

If you use this library inside iframes on Jira Server, auto-detection won't work, you need to manually set 'server' mode and set proper Jira base URL.

    Vue.use(VueAuiJira, {
        mode: 'server',
        url: jiraBaseUrl
    });

## Usage

Installation registers components and Jira API object globally.

#### Use components

    <va-user-picker multiple v-model="participants"/>

#### Use Jira API

    this.$jira.getProject(projectId);
