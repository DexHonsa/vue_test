<template>
  <div>

  <div class="left-sidebar-container">
    <div class="left-nav-sidebar">
      <div class="left-nav-sidebar-inner">
      <div class="logo-container">
        <img src="../../img/logo_icon.svg" />
      </div>
      <div  class="left-nav-collapse-container">
        <i class="fa fa-angle-left" />
      </div>
      <ul>
        <li v-on:click="activateTab(0)" class="inactive" v-bind:class="{active: activeClasses[0]}"><i class="fa fa-building-o" /> <label>Companies</label></li>
        <li v-on:click="activateTab(1)" class="inactive" v-bind:class="{active: activeClasses[1]}" ><i class="fa fa-folder-o" /> <label>Projects</label></li>
        <li v-on:click="activateTab(2)" class="inactive" v-bind:class="{active: activeClasses[2]}" ><i class="fa fa-diamond" /> <label>Mines</label></li>
        <li class="inactive" ><i class="fa fa-truck" /> <label>Suppliers</label></li>
        <li class="inactive" ><i class="fa fa-cubes" /> <label>Block Models</label></li>
        <li class="inactive" ><i class="fa fa-wrench" /> <label>Equipment</label></li>
        <li class="inactive"><i class="fa fa-user-circle" /> <label>Users</label></li>
        <li class="inactive" ><i class="fa fa-connectdevelop" /> <label>Visualization</label></li>
        <li class="inactive" ><i class="fa fa-connectdevelop" /> <label>Algorithms</label></li>
      </ul>
                </div>
    </div>
    <LeftSubSidebar></LeftSubSidebar>
  </div>
  </div>
</template>

<script>
import LeftSubSidebar from './left_sub_sidebar.vue';

  export default {
    name: 'left-sidebar',
    data: function(){
      return{
        activeClasses:[false,false,false],
        activeTabName:''
      }
    },
    components:{
        LeftSubSidebar
    },
    methods: {
      activateTab:function(tab){
        var tabs = this.activeClasses;
         tabs.splice(tab,1);
        tabs[tab] = true;
        this.activeClasses = tabs;
        console.log(this.activeClasses);

      }
    }
  }
</script>
