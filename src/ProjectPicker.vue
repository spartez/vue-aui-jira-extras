<template>
    <aui-select2-single
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
        <span slot="formatResult" slot-scope="option">
        <aui-avatar squared size="xsmall" :src="option.data.avatarUrls['48x48']" class="result-project"/>
        {{option.data.name}}
    </span>
    </aui-select2-single>
</template>

<script>
    // TODO add recently accessed section
    // TODO Move to squared avatars (border-radius 3px) and support them in vue-aui

    export default {
        props: {
            placeholder: String,
            value: String
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
            }
        }
    }
</script>

<style scoped>
    .result-project {
        margin-right: 5px;
    }
</style>