const clinicMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  GET_ALL_SPECIALTY_SUCCESS: "GET_ALL_SPECIALTY_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
};

const clinicActionTypes = {
  FETCH_ALL_CLINIC: "FETCH_ALL_CLINIC",
  FETCH_ALL_SPECIALTY_CLINIC: "FETCH_ALL_SPECIALTY_CLINIC",
  FETCH_CREATE_CLINIC: "FETCH_CREATE_CLINIC",
  FETCH_UPDATE_CLINIC: "FETCH_UPDATE_CLINIC",
  FETCH_DELETE_CLINIC: "FETCH_DELETE_CLINIC",
  CHANGE_FILTER: "CHANGE_FILTER",
};

/**
 *
 * @param {string} action
 * @returns
 */
function clinicActions(action) {
  return `clinic/${action}`;
}

export { clinicActionTypes, clinicMutationTypes, clinicActions };
