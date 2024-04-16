const userMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
  SET_FILTER_DOCTOR: "SET_FILTER_DOCTOR",
  GET_DOCTOR_SUCCEED: "GET_DOCTOR_SUCCEED",
};

const userActionTypes = {
  FETCH_ALL_USER: "FETCH_ALL_USER",
  FETCH_CREATE_USER: "FETCH_CREATE_USER",
  FETCH_UPDATE_USER: "FETCH_UPDATE_USER",
  FETCH_UPDATE_DOCTOR: "FETCH_UPDATE_DOCTOR",
  FETCH_DELETE_USER: "FETCH_DELETE_USER",
  CHANGE_FILTER: "CHANGE_FILTER",
  CHANGE_FILTER_DOCTOR: "CHANGE_FILTER_DOCTOR",
  GET_DOCTOR: "GET_DOCTOR",
};

/**
 *
 * @param {string} action
 * @returns
 */
function userActions(action) {
  return `user/${action}`;
}

export { userActionTypes, userMutationTypes, userActions };
