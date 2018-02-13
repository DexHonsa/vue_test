<template>
  <div>
    <Companies v-if="getActivePage === 'companies'" />
    <Projects v-if="getActivePage === 'projects'" />
  </div>
</template>

<script>
import Companies from "../company/companies";
import Projects from "../project/projects";
export default {
  name: "Stage",

  data: () => ({
    activePage: "companies"
  }),
  components: {
    Companies,
    Projects
  },

  computed: {
    getActivePage: {
      get: function() {
        return this.$store.getters.activePage;
        console.log(this.$store.state.activePage);
      },
      set: function() {
        this.activePage = this.$store.state.activePage;
      }
    }
  }
};
</script>
