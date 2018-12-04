import {storiesOf} from '@storybook/vue';


storiesOf('UserPicker', module)
    .add('server story', () => ({
        template: `
        <div>
            <va-user-picker-server v-model="userKey"/>
            <va-button type="link" @click="userKey = undefined">Clear</va-button>
            
            <form class="aui">
                <va-user-picker-server multiple allow-groups v-model="userKeys" :locked="locked" placeholder="Select some users"/>
            </form>
            <va-button type="link" @click="locked = []">Clear locks</va-button>
            <va-button type="link" @click="userKeys = []">Clear</va-button>
        </div>`,
        data() {
            return {
                locked: ['admin'],
                lockedIssueTypes: ['10101'],
                userKeys: ["admin", "mdavis-sd-demo"],
                userKey: "admin",

            }
        }
    }))
    .add('cloud story', () => ({
        template: `
        <div>
            <va-user-picker-cloud v-model="userId"/>
            <va-button type="link" @click="userId = undefined">Clear</va-button>

            <form class="aui">
                <va-user-picker-cloud multiple allow-groups v-model="userIds" :locked="locked" placeholder="Select some users"/>
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
