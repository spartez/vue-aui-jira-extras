<template>
    <aui-select2-single ref="select"
                        v-if="!multiple"
                        :allow-clear="allowClear"
                        :disabled="disabled"
                        :value="value"
                        :placeholder="placeholder"
                        @input="$emit('input', $event)"
    >
        <aui-select2-option v-for="issueType in issueTypes"
                            :value="issueType.id"
                            :text="issueType.name"
                            :data="issueType"/>
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar squared size="xsmall" :src="option.data.iconUrl"/>
            {{option.data.name}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-issuetype">
            <aui-avatar size="xsmall" :src="option.data.iconUrl" class="result-issuetype-avatar"/>
            <span class="result-issuetype-name">{{option.data.name}}</span>
        </span>
    </aui-select2-single>
    <aui-select2-multi v-else
                       ref="select"
                       :disabled="disabled"
                       :value="value"
                       :placeholder="placeholder"
                       @input="$emit('input', $event)"
    >
        <aui-select2-option v-for="issueType in issueTypes"
                            :value="issueType.id"
                            :text="issueType.name"
                            :data="issueType"/>
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar squared size="xsmall" :src="option.data.iconUrl"/>
            {{option.data.name}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-issuetype">
            <aui-avatar size="xsmall" :src="option.data.iconUrl" class="result-issuetype-avatar"/>
            <span class="result-issuetype-name">{{option.data.name}}</span>
        </span>
    </aui-select2-multi>
</template>

<script>

    // TODO Subtasks settins

    export default {
        props: {
            allowClear: Boolean,
            disabled: Boolean,
            locked: {
                type: Array,
                default: () => []
            },
            multiple: Boolean,
            placeholder: String,
            projectId: String,
            subtasks: {
                type: Boolean,
                default: true,
            },
            nonSubtasks: {
                type: Boolean,
                default: true,
            },
            value: [String, Array]
        },

        watch: {
            locked: {
                deep: true,
                handler() {
                    this.$refs.select.$emit('dataChanged');
                }
            },

            projectId() {
                this.updateOptions()
            },

            subtasks() {
                this.updateOptions()
            },

            nonSubtasks() {
                this.updateOptions()
            },
        },

        data() {
            return {issueTypes: []}
        },

        beforeCreate() {
            // TODO support locked, needs aui-select2-option support for locked items
            this.getIssueCreateMetaPromise = this.$jira.getIssueCreateMeta();
        },

        created() {
            this.updateOptions()
        },

        methods: {
            updateOptions() {
                this.getIssueCreateMetaPromise.then(issueCreateMeta => {
                    let projectIssueTypes = issueCreateMeta.projects.find(project => project.id === this.projectId);
                    this.issueTypes = projectIssueTypes && projectIssueTypes.issuetypes
                            .filter(issueType => issueType.subtask && this.subtasks
                                || !issueType.subtask && this.nonSubtasks)
                })
            }
        }

    }
</script>

<style scoped>
    .result-issuetype {
        align-items: center;
        display: flex;
    }

    .result-issuetype-name {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px;
    }
</style>