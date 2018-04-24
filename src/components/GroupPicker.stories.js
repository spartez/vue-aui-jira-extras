import {storiesOf} from '@storybook/vue';

storiesOf('GroupPicker', module)
    .add('story', () => ({
        template: `
        <div>
            <va-group-picker v-model="group"/>
            <form class="aui"><va-group-picker multiple v-model="groups" placeholder="Select groups for access"/></form>
        </div>`,
        data() {
            return {
                group: "site-admins",
                groups: ["administrators", 'jira-core-users']
            }
        }
    }));
