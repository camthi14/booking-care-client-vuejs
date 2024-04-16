const countMutationTypes = {
  START: "START",
  GET_SUCCESS: "GET_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
};

const countActionTypes = {
  GET_COUNT: "GET_COUNT",
};

/**
 *
 * @param {string} action
 * @returns
 */
function countActions(action) {
  return `count/${action}`;
}

export { countActionTypes, countMutationTypes, countActions };
