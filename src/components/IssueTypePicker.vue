<template>
    <va-select2 ref="select"
                :multiple="multiple"
                :allow-clear="allowClear"
                :disabled="disabled"
                :init-selection="initSelection"
                :locked="locked"
                :minimum-results-for-search="5"
                :placeholder="placeholder"
                :query="query"
                :value="value"
                @input="$emit('input', $event)"
    >
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar squared size="xsmall" :src="option.data.iconUrl"/>
            {{option.data.name}}
        </span>

        <span slot="formatResult" slot-scope="option" class="result-issuetype">
            <aui-avatar size="xsmall" :src="option.data.iconUrl" class="result-issuetype-avatar"/>
            <span class="result-issuetype-name">{{option.data.name}}</span>

        </span>
    </va-select2>
</template>

<script>
    export default {
        props: {
            allowClear: Boolean,
            disabled: Boolean,
            locked: {
                type: Array,
                default: () => []
            },
            multiple: Boolean,
            nonSubtasks: {
                type: Boolean,
                default: true,
            },
            placeholder: String,
            projectId: String,
            subtasks: {
                type: Boolean,
                default: true,
            },
            value: [String, Array]
        },

        watch: {
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

        beforeCreate() {
            this.getIssueCreateMetaPromise = this.$jira.getIssueCreateMeta();
        },

        created() {
            this.updateOptions()
        },

        methods: {
            mapIssueTypeToOption(issueType) {
                return {
                    id: issueType.id,
                    text: issueType.name,
                    data: issueType
                }
            },

            query(query) {
                if (query.term === undefined) {
                } else {
                    this.getIssueTypes.then(issueTypes => {
                        query.callback({
                            results: issueTypes
                                .filter(issueType => issueType.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0)
                                .map(issueType => this.mapIssueTypeToOption(issueType))
                        })
                    })
                }
            },

            initSelection(element, callback) {
                if (this.multiple) {
                    if (element.val()) {
                        const issueTypeIds = element.val().split(',');
                        this.getIssueTypes.then(issueTypes => {
                            let issueTypeOptions = issueTypeIds
                                .map(issueTypeId => issueTypes.find(issueType => issueType.id === issueTypeId))
                                .filter(issueType => issueType)
                                .map(issueType => this.mapIssueTypeToOption(issueType));
                            callback(issueTypeOptions)
                        })
                    } else {
                        callback([])
                    }
                } else {
                    if (element.val()) {
                        this.getIssueTypes.then(issueTypes => {
                            const issueType = issueTypes.find(issueType => issueType.id === element.val());
                            if (issueType) {
                                callback(this.mapIssueTypeToOption(issueType))
                            }
                        })
                    }
                }
            },

            updateOptions() {
                this.getIssueTypes = this.getIssueCreateMetaPromise.then(issueCreateMeta => {
                    const projectIssueTypes = issueCreateMeta.projects.find(project => project.id === this.projectId);
                    const filteredIssueTypes = projectIssueTypes
                        ? projectIssueTypes.issuetypes.filter(
                            issueType => issueType.subtask && this.subtasks || !issueType.subtask && this.nonSubtasks)
                        : [];

                    const firstIssueTypeId = filteredIssueTypes[0] && filteredIssueTypes[0].id;

                    // Autoselect first value in single select
                    if (!this.value && !this.multiple) {
                        this.$emit('input', firstIssueTypeId);
                    }

                    return filteredIssueTypes;
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