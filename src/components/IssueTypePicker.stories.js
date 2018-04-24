import {storiesOf} from '@storybook/vue';


storiesOf('IssueTypePicker', module)
    .add('story', () => ({
        template: `
            <div>
                <va-issue-type-picker allow-clear v-model="issueType" project-id="10651"/>
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
                </form>
            </div>`,
        data() {
            return {
                issueType: "10004",

                issueTypes: ["10101"],
                showSubtasksOnly: false,
                lockedIssueTypes: ['10101'],
            }
        }
    }));