import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    activePage: "companies"
  },
  getters: {
    activePage(state) {
      return state.activePage;
    }
  },
  mutations: {
    changeActivePage(state, payload) {
      this.state.activePage = payload;
      return this.state.activePage;
    }
  }
});
