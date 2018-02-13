<template>
<div>
  <div class="left-sidebar-container">
    <div class="left-nav-sidebar">
      <div class="left-nav-sidebar-inner">
        <div class="logo-container">
          <img src="../../img/logo_icon.svg" />
        </div>
        <div class="left-nav-collapse-container">
          <i class="fa fa-angle-left" />
        </div>
        <ul>
          <li v-on:click="activateTab('companies')" class="inactive" v-bind:class="{active: companies}"><i class="fa fa-building-o" /> <label>Companies</label></li>
          <li v-on:click="activateTab('projects')" class="inactive" v-bind:class="{active: projects}"><i class="fa fa-folder-o" /> <label>Projects</label></li>
          <li v-on:click="activateTab('mines')" class="inactive" v-bind:class="{active: mines}"><i class="fa fa-diamond" /> <label>Mines</label></li>
          <li class="inactive"><i class="fa fa-truck" /> <label>Suppliers</label></li>
          <li class="inactive"><i class="fa fa-cubes" /> <label>Block Models</label></li>
          <li class="inactive"><i class="fa fa-wrench" /> <label>Equipment</label></li>
          <li class="inactive"><i class="fa fa-user-circle" /> <label>Users</label></li>
          <li class="inactive"><i class="fa fa-connectdevelop" /> <label>Visualization</label></li>
          <li class="inactive"><i class="fa fa-connectdevelop" /> <label>Algorithms</label></li>
        </ul>
      </div>
    </div>

  </div>
</div>
</template>

<script>
export default {
  name: "left-sidebar",
  data: function() {
    return {
      companies: true,
      projects: false,
      mines: false
    };
  },
  components: {},
  methods: {
    activateTab: function(tab) {
      this.companies = false;
      this.projects = false;
      this.mines = false;
      this[tab] = true;
      this.$store.commit("changeActivePage", tab);
    }
  },
  computed: {}
};
</script>
