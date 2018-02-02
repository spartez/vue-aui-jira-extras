<template>
    <!-- TODO support multiple attribute in vue-aui -->
    <aui-select2-single v-if="!multiple"
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
            {{option.data.displayName}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-user">
            <aui-avatar size="medium" :src="option.data.avatarUrls['48x48']" class="result-user-avatar"/>
            <div class="result-user-text">
                <span class="result-user-fullname">{{option.data.displayName}}</span>
                <span class="result-user-name">@{{option.data.name}}</span>
            </div>
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
            {{option.data.displayName}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-user">
            <aui-avatar size="medium" :src="option.data.avatarUrls['48x48']" class="result-user-avatar"/>
            <div class="result-user-text">
                <span class="result-user-fullname">{{option.data.displayName}}</span>
                <span class="result-user-name">@{{option.data.name}}</span>
            </div>
        </span>
    </aui-select2-multi>
</template>

<script>
    export default {
        props: {
            allowClear: Boolean,
            disabled: Boolean,
            multiple: Boolean,
            placeholder: String,
            value: [String, Array]
        },

        methods: {
            mapUserToOption(user) {
                return {
                    id: user.key,
                    data: user
                }
            },

            queryValues(query) {
                if (query.term === undefined) {
                } else {
                    this.$jira.getUsers(query.term).then(users => {
                        const userItems = users.map(user => this.mapUserToOption(user));
                        query.callback({results: userItems})
                    })
                }
            },

            initialValue(element, callback) {
                if (element.val()) {
                    this.$jira.getUser(element.val())
                        .then(user => callback(this.mapUserToOption(user)))
                }
            },

            initialValues(element, callback) {
                if (element.val()) {
                    const userKeys = element.val().split(',');

                    Promise.all(userKeys.map(userKey => this.$jira.getUser(userKey)))
                        .then(users => {
                            const userItems = users.filter(user => user).map(user => this.mapUserToOption(user));
                            callback(userItems);
                        });
                } else {
                    callback([])
                }
            }
        }
    }
</script>

<style scoped>
    .result-user {
        align-items: center;
        display: flex;
        padding: 3px 2px;
    }

    .result-user-avatar {
        margin-right: 15px;
    }

    .result-user-text {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .result-user-name,
    .result-user-fullname {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .result-user-name {
        font-size: 12px;
        font-weight: 600;
        color: #8993A4;
    }
</style>