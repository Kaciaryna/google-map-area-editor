import Vue from 'vue'
import Vuex from 'vuex'
import actions from "@/store/actions";
import mutations from "@/store/mutations";
import {DEFAULT_STATE, State} from "@/models/State";

Vue.use(Vuex)

export default new Vuex.Store<State>({
  state: DEFAULT_STATE,
  mutations: mutations,
  actions: actions,
  strict: true,
})
