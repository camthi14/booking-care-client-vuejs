import authApi from "@/apis/authApi";
import router from "@/router";
import { toast } from "vue3-toastify";
import { appActions, appActionTypes, authActionTypes, authMutationTypes } from "../types";

const state = () => ({
  accessToken: localStorage.getItem("accessToken") || "",
  user: {},
  isLoading: false,
  error: "",
});

export const roles = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  CUSTOMER: "CUSTOMER",
  CLINIC: "CLINIC",
};

const mutations = {
  setAccessToken: (state, accessToken) => {
    state.accessToken = accessToken;
  },

  setUser: (state, user) => {
    state.user = user;
  },

  // * LOGIN
  [authMutationTypes.LOGIN_START]: (state) => {
    state.isLoading = true;
  },

  [authMutationTypes.LOGIN_SUCCEED]: (state, payload) => {
    state.isLoading = false;
    state.accessToken = payload;
  },

  // * LOGOUT
  [authMutationTypes.LOGOUT_START]: (state) => {
    state.isLoading = true;
  },

  [authMutationTypes.LOGOUT_SUCCEED]: (state) => {
    state.isLoading = false;
    state.accessToken = "";
    state.user = {};
    localStorage.removeItem("accessToken");
  },

  // * GET CURRENT USER
  [authMutationTypes.GET_CURRENT_USER_START]: (state) => {
    state.isLoading = true;
  },

  [authMutationTypes.GET_CURRENT_USER_SUCCEED]: (state, payload) => {
    state.isLoading = false;
    state.user = payload;
  },

  // * REGISTER SUCCESS
  [authMutationTypes.REGISTER_SUCCESS]: (state) => {
    state.isLoading = false;
  },

  // * FAILED
  [authMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
};

const actions = {
  saveAccessToken: ({ commit }, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    commit("setAccessToken", accessToken);
  },

  saveUser: ({ commit }, user) => {
    commit("setUser", user);
  },

  [authActionTypes.GET_CURRENT_USER]: async (
    { commit, dispatch },
    { accessToken, isManager = false }
  ) => {
    try {
      if (!accessToken) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        return;
      }

      // * START
      commit(authMutationTypes.GET_CURRENT_USER_START);

      // * payload => accessToken
      const response = await authApi.getCurrentUser(accessToken);

      if (response.data) {
        // * SUCCEED
        commit(authMutationTypes.GET_CURRENT_USER_SUCCEED, response.data);
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

        if (isManager && response.data.role === roles.CUSTOMER) {
          router.push({ path: "/" });
        }
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },

  remove: ({ commit }) => {
    localStorage.removeItem("accessToken");
    commit("setUser", {});
    commit("setAccessToken", "");
  },

  [authActionTypes.FETCH_LOGIN]: async ({ commit, dispatch }, payload) => {
    try {
      // * start login
      commit(authMutationTypes.LOGIN_START);

      // * call api
      const response = await authApi.signIn(payload);

      if (response) {
        // * login succeed
        localStorage.setItem("accessToken", response.accessToken);
        commit(authMutationTypes.LOGIN_SUCCEED, response.accessToken);
        toast.success("Đăng nhập thành công!");

        if (response.isHome) {
          router.push("/");
        } else {
          router.push({ path: "/manager/dashboard" });
        }
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },

  [authActionTypes.FETCH_LOGOUT]: async ({ commit, dispatch }) => {
    try {
      commit(authMutationTypes.LOGOUT_START);

      const response = await authApi.signOut();
      commit(authMutationTypes.LOGOUT_SUCCEED);
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
      toast.success("Đăng xuất thành công!");

      router.push({ path: "/login" });
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },

  [authActionTypes.FETCH_REGISTER]: async ({ commit, dispatch }, payload) => {
    try {
      commit(authMutationTypes.LOGIN_START);

      const response = await authApi.signUp(payload);

      if (response) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        commit(authMutationTypes.REGISTER_SUCCESS);
        toast.success("Đăng ký thành công!");
        router.push({ path: "/login" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },

  [authActionTypes.RESET_PASSWORD]: async ({ commit, dispatch }, payload) => {
    try {
      commit(authMutationTypes.LOGIN_START);

      const response = await authApi.resetPassword(payload);

      if (response) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        commit(authMutationTypes.REGISTER_SUCCESS);
        toast.success("Đổi mật khẩu thành công!");
        router.push({ path: "/login" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },

  [authActionTypes.FORGOT_PASSWORD]: async ({ commit, dispatch }, payload) => {
    try {
      commit(authMutationTypes.LOGIN_START);

      const response = await authApi.forgotPassword(payload);

      if (response) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        commit(authMutationTypes.REGISTER_SUCCESS);
        toast.success("Gửi mail thành công. Vui lòng kiểm tra email!");
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(authMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(authMutationTypes.FAILED, error.message);
      }
    }
  },
};

const getters = {
  //Kiểm tra xe người dùng đăng nhập chưa?
  // isLoggedIn: (state) => {
  //   return state.accessToken !== "" ? true : false;
  // },
  getUser: (state) => {
    return state.user;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
