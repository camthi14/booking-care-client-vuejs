import { appActionTypes, appMutationTypes } from "../types";

const state = () => ({
  openOverlay: false,
  snackbar: {
    open: false,
    timeout: 3500,
    color: "default",
    message: "",
  },
});

const mutations = {
  [appMutationTypes.SET_OVERLAY]: (state, payload) => {
    state.openOverlay = payload;
  },
  [appMutationTypes.SET_SNACKBAR]: (state, payload) => {
    state.snackbar = { ...state.snackbar, ...payload };
  },
};

const actions = {
  [appActionTypes.SET_OVERLAY]: ({ commit }, payload) => {
    commit(appMutationTypes.SET_OVERLAY, payload);
  },
  [appActionTypes.SET_SNACKBAR]: ({ commit }, payload) => {
    commit(appMutationTypes.SET_SNACKBAR, payload);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
