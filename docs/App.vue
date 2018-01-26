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
                            <va-project-picker v-model="projectId" placeholder="Select a project..."></va-project-picker>
                        </p>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {projectId: "10706"}
        }
    }
</script>