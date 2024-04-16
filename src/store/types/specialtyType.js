const specialtyMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
};

const specialtyActionTypes = {
  FETCH_ALL_SPECIALTY: "FETCH_ALL_SPECIALTY",
  FETCH_CREATE_SPECIALTY: "FETCH_CREATE_SPECIALTY",
  FETCH_UPDATE_SPECIALTY: "FETCH_UPDATE_SPECIALTY",
  FETCH_DELETE_SPECIALTY: "FETCH_DELETE_SPECIALTY",
  CHANGE_FILTER: "CHANGE_FILTER",
};

/**
 *
 * @param {string} action
 * @returns
 */
function specialtyActions(action) {
  return `specialty/${action}`;
}

export { specialtyActionTypes, specialtyMutationTypes, specialtyActions };
