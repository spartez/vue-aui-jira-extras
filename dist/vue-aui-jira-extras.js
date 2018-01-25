'use strict';

var ProjectPicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aui-select2-single',{attrs:{"placeholder":_vm.placeholder}})},staticRenderFns: [],
    props: {
        placeholder: String,
    }
}

var vueAuiJiraExtras = {
    install(Vue, options) {
        Vue.component('va-project-picker', ProjectPicker);
    }
}

module.exports = vueAuiJiraExtras;
