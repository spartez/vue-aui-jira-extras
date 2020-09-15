<template>
    <va-select2
            :allow-clear="allowClear"
            :disabled="disabled"
            :init-selection="initialMultiValues"
            :multiple="multiple"
            :placeholder='placeholder'
            :query="queryGroups"
            :value="value"
            @input="$emit('input', $event)"
    />
</template>

<script>
    export default {
        props: {
            allowClear: Boolean,
            disabled: Boolean,
            multiple: Boolean,
            placeholder: {type: String, default: "Select groups..."},
            value: {
                type: [Array, String],
                required: true
            },
        },

        methods: {
            mapGroupToGroupOption(group) {
                return {id: group, text: group}
            },

            queryGroups({term, callback}) {
                this.$jira.getGroupsForPicker({query: term}).then(groupsResults => {
                    groupsResults.groups.map(group => group.name = group.html)
                    callback({results: groupsResults.groups.map(group => this.mapGroupToGroupOption(group.name))});
                })
            },

            initialMultiValues(element, callback) {
                const value = element.val();
                if (!this.multiple) {
                    if (value) {
                        callback(this.mapGroupToGroupOption(value));
                    }
                } else {
                    if (value) {
                        const items = value.split(',').map(this.mapGroupToGroupOption);
                        callback(items);
                    } else {
                        callback([]);
                    }
                }
            }

        },
    }
</script>
