import {storiesOf} from '@storybook/vue';


storiesOf('GroupPicker', module)
  .add('simple', () => ({
    template: '<va-group-picker v-model="group"/>', data() {
      return {
        group: "site-admins",
      }
    }
  }))

  .add('multiple with placeholder', () => ({
    template: `<form class="aui"><va-group-picker multiple v-model="groups" placeholder="Select groups for access"/></form>`,
    data() {
      return {groups: ["administrators", 'jira-core-users']}
    }
  }));
