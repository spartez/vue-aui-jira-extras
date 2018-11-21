import {storiesOf} from '@storybook/vue';


storiesOf('UserPicker', module)
    .add('story', () => ({
        template: `
        <div>
            <va-user-picker v-model="userId"/>
            <va-button type="link" @click="userId = undefined">Clear</va-button>
            
            <form class="aui">
                <va-user-picker multiple allow-groups v-model="userIds" :locked="locked" placeholder="Select some users"/>
            </form>
            <va-button type="link" @click="locked = []">Clear locks</va-button>
            <va-button type="link" @click="userIds = []">Clear</va-button>
        </div>`,
        data() {
            return {
                locked: ['adminId'],
                lockedIssueTypes: ['10101'],
                userIds: ["adminId", "mdavisId"],
                userId: "adminId",

            }
        }
    }));
