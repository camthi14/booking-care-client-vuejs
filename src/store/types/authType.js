export const authMutationTypes = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCEED: "LOGIN_SUCCEED",
  LOGOUT_START: "LOGOUT_START",
  LOGOUT_SUCCEED: "LOGOUT_SUCCEED",
  GET_CURRENT_USER_START: "GET_CURRENT_USER_START",
  GET_CURRENT_USER_SUCCEED: "GET_CURRENT_USER_SUCCEED",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  FAILED: "FAILED",
};

export const authActionTypes = {
  FETCH_LOGIN: "FETCH_LOGIN",
  FETCH_LOGOUT: "FETCH_LOGOUT",
  FETCH_REGISTER: "FETCH_REGISTER",
  GET_CURRENT_USER: "GET_CURRENT_USER",
  RESET_PASSWORD: "RESET_PASSWORD",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

/**
 *
 * @param {string} action
 * @returns
 */
export function authActions(action) {
  return `auth/${action}`;
}
