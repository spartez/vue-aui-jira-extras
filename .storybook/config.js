import {configure} from '@storybook/vue';

import './style.css'
import 'babel-polyfill/dist/polyfill'

const $ = require('jquery');
window.jQuery = $;

require('@atlassian/aui/dist/aui/css/aui.css');
require('@atlassian/aui/dist/aui/css/aui-experimental.css');
require("@atlassian/aui/dist/aui/js/aui.min");
require("@atlassian/aui/dist/aui/js/aui-experimental.min");
require("@atlassian/aui/dist/aui/js/aui-datepicker.min");
require("@atlassian/aui/dist/aui/js/aui-soy.min");

import Vue from 'vue';
import VueAui from 'vue-aui';
import VueAuiJira from '../src/vue-aui-jira-extras';

Vue.use(VueAui);
Vue.use(VueAuiJira);

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
