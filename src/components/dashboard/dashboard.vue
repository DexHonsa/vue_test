<template>
<div>
  <div class="main-container">
    <Header />
    <div class="main-content-container">
      <leftSidebar></leftSidebar>
      <!-- <LeftSidebar  sidebarTab={this.props.location.pathname.substr(1)} visualizerOpen={this.state.visualizerOpen} setTab={this.setTab.bind(this)} /> -->
      <div class="stage-container">
        <div class="tab-stage">
          <!-- <TabContainer removeVisualizer={this.removeVisualizer.bind(this)}  activeTabIndex={this.state.activeTab} activeTab={this.state.tabs[this.state.activeTab]} tabs={this.state.tabs} activateTab={this.activateTab.bind(this)} /> -->
        </div>
        <Stage name="Company 1" ></Stage>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import leftSidebar from "./left_sidebar.vue";
import Header from "../header";
import Stage from "./stage";
export default {
  name: "Dashboard",
  data: function() {
    return {};
  },
  components: {
    leftSidebar,
    Header,
    Stage
  },
  methods: {}
};
</script>
