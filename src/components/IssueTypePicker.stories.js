import {storiesOf} from '@storybook/vue';


storiesOf('IssueTypePicker', module)
  .add('simple', () => ({
    template: `<va-issue-type-picker allow-clear v-model="issueType" project-id="10651"/>`,
    data() {
      return {
        issueType: "10004",
      }
    }
  }))
  .add('complex', () => ({
    template: `
        <form class="aui">
            <p>
                <va-toggle v-model="showSubtasksOnly" label="Show subtasks only"/>
                <va-icon>close</va-icon>
            </p>
            <p>
                <va-issue-type-picker multiple v-model="issueTypes"
                                      project-id="10651"
                                      :locked="lockedIssueTypes"
                                      subtasks
                                      :non-subtasks="!showSubtasksOnly"
                                      placeholder="Select issue type"/>
            </p>
        </form>`,
    data() {
      return {
        issueTypes: ["10101"],
        showSubtasksOnly: false,
        lockedIssueTypes: ['10101'],
      }
    }
  }));