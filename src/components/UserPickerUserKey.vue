<template>
    <va-select2 ref="select"
                :allow-clear="allowClear"
                :disabled="disabled"
                :init-selection="initialValue"
                :locked="locked"
                :multiple="multiple"
                :placeholder="placeholder"
                :query="queryValues"
                :value="value"
                @input="onValueChanged($event)"
    >
        <span slot="formatSelection" slot-scope="option">
            <aui-avatar v-if="option.data.avatarUrls" squared size="xsmall" :src="option.data.avatarUrls['48x48']"/>
            {{option.data.displayName}}
        </span>
        <span slot="formatResult" slot-scope="option" class="result-user">
            <aui-avatar v-if="option.data.avatarUrls" size="medium" :src="option.data.avatarUrls['48x48']"
                        class="result-user-avatar"/>
            <aui-avatar v-else-if="option.data.avatarUrl" size="medium" :src="option.data.avatarUrl"
                        class="result-user-avatar"/>
            <div class="result-user-text">
                <span class="result-user-fullname">{{option.data.displayName}}</span>
                <span class="result-user-name">{{`${!option.data.isGroup ? '@' :''}${option.data.name}`}}</span>
            </div>
        </span>
    </va-select2>
</template>

<script>
    const GROUP_PREFIX = "group\t";

    export default {
        props: {
            allowClear: Boolean,
            allowGroups: Boolean,
            disabled: Boolean,
            locked: {
                type: Array,
                default: () => []
            },
            multiple: Boolean,
            placeholder: String,
            value: [String, Array]
        },

        data() {
            return {myself: undefined}
        },

        async created() {
            this.myself = await this.$jira.getCurrentUser();
        },

        methods: {
            mapUserToOption(user) {
                return {
                    id: user.key,
                    data: user,
                }
            },

            onValueChanged: function (values) {
                if (!this.allowGroups || !this.multiple) {
                    return this.$emit('input', values);
                }

                const group = values.find(value => value.indexOf(GROUP_PREFIX) === 0);
                if (!group) {
                    return this.$emit('input', values);
                }

                this.$jira.getUsersFromGroup(group.substring(GROUP_PREFIX.length)).then(result => {
                    const expandedValues = values
                        .filter(value => value.indexOf(GROUP_PREFIX) === -1)
                        .concat(result.values.map(v => v.key))
                        .filter((value, index, array) => index === array.indexOf(value)); //unique() equivalent
                    this.$emit('input', expandedValues);
                });
            },

            queryValues(query) {
                if (query.term === undefined) {
                } else {
                    const showMyselfOnTop = this.myself && query.term === '';

                    if (showMyselfOnTop) {
                        query.callback({results: [this.mapUserToOption(this.myself)]});
                    }

                    if (this.allowGroups && this.multiple) {
                        this.$jira.findUsersAndGroups(query.term).then(results => {
                            const groupItems = results.groups.groups.map(group => ({
                                id: GROUP_PREFIX + group.name,
                                data: {
                                    displayName: `${group.name}`,
                                    name: '(user group)',
                                    isGroup: true,
                                },
                            }));
                            const userItems = results.users.users.map(user => this.mapUserToOption(user));
                            if (query.term) {
                                query.callback({results: [...userItems, ...groupItems]});
                            } else {
                                query.callback({results: userItems});
                            }
                        });
                    } else {
                        this.$jira.getUsers(query.term).then(users => {
                            const usersForPicker = showMyselfOnTop
                                ? [this.myself, ...users.filter(user => user.key !== this.myself.key)]
                                : users;

                            const userItems = usersForPicker.map(user => this.mapUserToOption(user));
                            query.callback({results: userItems})
                        });
                    }
                }
            },

            initialValue(element, callback) {
                if (this.multiple) {
                    if (element.val()) {
                        const userKeys = element.val().split(',');

                        Promise.all(userKeys.map(userKey => this.$jira.getUser({key: userKey})))
                            .then(users => {
                                const userItems = users.filter(user => user).map(user => this.mapUserToOption(user));
                                callback(userItems);
                            });
                    } else {
                        callback([])
                    }
                } else {
                    if (element.val()) {
                        this.$jira.getUser({key: element.val()})
                            .then(user => callback(this.mapUserToOption(user)))
                    }
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