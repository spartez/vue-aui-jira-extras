<template>
    <aui-select2-single
            :placeholder="placeholder"
            :query="queryValues"
            :init-selection="initialValue"
    />
</template>

<script>
    import {getProjects} from './api/JiraApi'

    export default {
        props: {
            placeholder: String,
        },

        methods: {
            queryValues(query) {
                if (query.term === undefined) {
                } else {
                    getProjects().then(projects => {
                        const projectItems = projects
                            .filter(project => project.key === query.term.toUpperCase()|| project.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0)
                            .map(project => ({id: project.id, text: `${project.name} (${project.key})`}));
                        query.callback({results: projectItems})
                    })
                }
            },

            initialValue(element, callback) {
                // TODO
                if (element.val() === "initialValue") {
                    setTimeout(() => callback({id: "initialValue", text: "Initial Value"}), 300)
                }
            }
        }
    }
</script>
