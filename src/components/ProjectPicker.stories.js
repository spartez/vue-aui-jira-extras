import {storiesOf} from '@storybook/vue';


storiesOf('ProjectPicker', module)
    .add('story', () => ({
        template: `
            <div>
                <va-project-picker allowClear v-model="projectId"/>
                <form class="aui">
                  <va-project-picker multiple v-model="projectIds" placeholder="Select a project..."/>
                </form>
                <va-button type="link" @click="projectIds = []">Clear</va-button>
            </div>`,
        data() {
            return {
                projectId: "10706",
                projectIds: ["10705"],
            }
        }
    }));
