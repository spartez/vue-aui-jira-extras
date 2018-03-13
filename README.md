# vue-aui-jira-extras

> This library is still in progress.

[![npm version](https://badge.fury.io/js/vue-aui-jira-extras.svg)](https://badge.fury.io/js/vue-aui-jira-extras)

`vue-aui-jira-extras` is an addition to [vue-aui](https://github.com/spartez/vue-aui).
It implements various Jira pickers using UI components from `vue-aui` library. 

Features:

* Supports Jira Server and Cloud out of the box (automatic detection)
* No manual data feeding - components fetch needed data
* API autocompletion provided by Typescript typings

## Implemented pickers

* [x] Project picker (`va-project-picker`)
* [x] User picker (`va-user-picker`)
* [x] Issue type picker (`va-issue-type-picker`)
* [x] Group picker (`va-group-picker`)
* [ ] Issue picker

## Installation

    npm install vue-aui-jira-extras --save-dev
    
After that add this to install library
    
    import VueAuiJira from 'vue-aui-jira-extras'

    Vue.use(VueAuiJira);
    
Installation registers components and Jira API object globally. 
Jira version (Cloud or Server) will be detected automatically and proper API will be used.

### Use components

    <va-user-picker multiple v-model="participants"/>
    
Yes, that's it.

### Use Jira API

    this.$jira.getProject(projectId);
