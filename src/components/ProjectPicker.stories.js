import {storiesOf} from '@storybook/vue';


storiesOf('ProjectPicker', module)
  .add('simple', () => ({
    template: `<va-project-picker allowClear v-model="projectId"/>`,
    data() {
      return {
        projectId: "10706",
      }
    }

  }))

  .add('multiple with placeholder', () => ({
    template: `<div>
        <form class="aui">
          <va-project-picker multiple v-model="projectIds" placeholder="Select a project..."/>
        </form>
        <va-button type="link" @click="projectIds = []">Clear</va-button></div>`,
    data() {
      return {
        projectIds: ["10705"],
      }
    }
  }));
