import {storiesOf} from '@storybook/vue';


storiesOf('UserPicker', module)
  .add('simple', () => ({
    template: `
        <div>
            <va-user-picker v-model="userKey"/>
            <va-button type="link" @click="userKey = undefined">Clear</va-button>
        </div>`, data() {
      return {
        userKey: "admin",
      }
    }
  }))

  .add('multiple with placeholder', () => ({
    template: `
        <div>
          <form class="aui">
              <va-user-picker multiple v-model="userKeys" :locked="locked"
                              placeholder="Select some users"/>
          </form>
          <va-button type="link" @click="locked = []">Clear locks</va-button>
          <va-button type="link" @click="userKeys = []">Clear</va-button>
        </div>`,
    data() {
      return {
        locked: ['admin'],
        lockedIssueTypes: ['10101'],
        userKeys: ["admin", "mdavis-sd-demo"],
      }
    }
  }));
