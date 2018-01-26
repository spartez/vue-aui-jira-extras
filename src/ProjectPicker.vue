<template>
    <aui-select2-single v-if="!multiple"
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
            disabled: Boolean,
            multiple: Boolean,
            placeholder: String,
            value: [String, Array]
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
                    this.$jira.getProjects().then(projects => {
                        const projectItems = projectIds
                            .map(projectId => find(projects, {id: projectId}))
                            .map(project => this.mapProjectToProjectOption(project));
                        callback(projectItems)
                    })
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
        overflow-y: hidden;
    }
</style>