<template>
    <aui-select2-single v-if="!multiple"
                        ref="select"
                        :allow-clear="allowClear"
                        :disabled="disabled"
                        :value="value"
                        :placeholder="placeholder"
                        :query="queryValues"
                        :init-selection="initialValue"
                        @input="$emit('input', $event)"
    >
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar squared size="xsmall" :src="option.data.avatarUrls['48x48']"/>
            {{option.data.name}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-project">
            <aui-avatar squared size="xsmall" :src="option.data.avatarUrls['48x48']" class="result-project-avatar"/>
            <span class="result-project-name">{{option.data.name}}</span>
        </span>
    </aui-select2-single>
    <aui-select2-multi v-else
                       ref="select"
                       :disabled="disabled"
                       :value="value"
                       :placeholder="placeholder"
                       :query="queryValues"
                       :init-selection="initialValues"
                       @input="$emit('input', $event)"
    >
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar squared size="xsmall" :src="option.data.avatarUrls['48x48']"/>
            {{option.data.name}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-project">
            <aui-avatar squared size="xsmall" :src="option.data.avatarUrls['48x48']" class="result-project-avatar"/>
            <span class="result-project-name">{{option.data.name}}</span>
        </span>
    </aui-select2-multi>
</template>

<script>
    import find from 'lodash/find'
    // TODO add recently accessed section

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
            value: [String, Array]
        },

        watch: {
            locked: {
                deep: true,
                handler() {
                    this.$refs.select.$emit('dataChanged');
                }
            }
        },

        created() {
            this.getProjectsPromise = this.$jira.getProjects();
        },

        methods: {
            mapProjectToProjectOption(project) {
                return {
                    id: project.id,
                    locked: this.locked.indexOf(project.id) >= 0,
                    text: `${project.name} (${project.key})`,
                    data: project
                }
            },

            queryValues(query) {
                if (query.term === undefined) {
                } else {
                    this.getProjectsPromise.then(projects => {
                        const projectItems = projects
                            .filter(project => project.key === query.term.toUpperCase() || project.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0)
                            .map(project => this.mapProjectToProjectOption(project));
                        query.callback({results: projectItems})
                    })
                }
            },

            initialValue(element, callback) {
                if (element.val()) {
                    this.$jira.getProject(element.val()).then(project => {
                        callback(this.mapProjectToProjectOption(project))
                    })
                }
            },
            initialValues(element, callback) {
                if (element.val()) {
                    const projectIds = element.val().split(',');
                    this.getProjectsPromise.then(projects => {
                        const projectItems = projectIds
                            .map(projectId => find(projects, {id: projectId}))
                            .map(project => this.mapProjectToProjectOption(project));
                        callback(projectItems);
                    })
                } else {
                    callback([])
                }
            }
        }
    }
</script>

<style scoped>
    .result-project {
        align-items: center;
        display: flex;
        padding: 3px 2px;
    }

    .result-project-avatar {
        margin-right: 5px;
    }

    .result-project-name {
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>