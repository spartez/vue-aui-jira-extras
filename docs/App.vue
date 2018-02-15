<template>
    <div id="page">
        <header id="header" role="banner">
            <nav class="aui-header aui-dropdown2-trigger-group" role="navigation">
                <div class="aui-header-inner">
                    <div class="aui-header-primary">
                        <h1 id="logo" class="aui-header-logo"><a href="http://example.com/"><span
                                class="aui-header-logo-device">AUI</span></a></h1>
                        <ul class="aui-nav">
                            <li><a href="http://example.com/">Nav</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <section>
            <div class="aui-page-panel">
                <div class="aui-page-panel-inner">
                    <section class="aui-page-panel-content">

                        <h2>Jira Project Picker</h2>
                        <p>
                            <va-project-picker allow-clear v-model="projectId" placeholder="Select a project..."/>
                        </p>
                        <form class="aui">
                            <va-project-picker multiple v-model="projectIds" placeholder="Select a project..."/>
                        </form>
                        <va-button type="link" @click="projectIds = []">Clear</va-button>


                        <h2>Jira User Picker</h2>
                        <p>
                            <va-user-picker v-model="userKey"/>
                            <va-button type="link" @click="userKey = undefined">Clear</va-button>
                        </p>
                        <form class="aui">
                            <va-user-picker multiple v-model="userKeys" :locked="locked"
                                            placeholder="Select some users"/>
                        </form>
                        <va-button type="link" @click="locked = []">Clear locks</va-button>
                        <va-button type="link" @click="userKeys = []">Clear</va-button>


                        <h2>Issue Type Picker</h2>
                        <p>
                            <va-issue-type-picker allow-clear v-model="issueType" project-id="10651"/>
                        </p>
                        <form class="aui">
                            <va-issue-type-picker multiple v-model="issueTypes"
                                                  project-id="10651"
                                                  :subtasks="true"
                                                  :non-subtasks="!showSubtasksOnly"
                                                  placeholder="Select issue type"/>
                            <br>
                            <va-toggle v-model="showSubtasksOnly"/> <span>Show subtasks only</span>
                        </form>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                projectId: "10706",
                projectIds: ["10705"],
                userKey: "admin",
                userKeys: ["admin", "mdavis-sd-demo"],
                locked: ['admin'],
                issueType: "10004",
                issueTypes: ["10101"],
                showSubtasksOnly: false
            }
        }
    }
</script>