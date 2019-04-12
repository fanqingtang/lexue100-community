import Vue from "vue";
import Vuex from "vuex";
import actions from "./action.js";
import mutations from "./mutation.js";
import state from "./state.js";

Vue.use(Vuex);

const store = new Vuex.Store({
    actions,
    mutations,
    state
});

export default store;