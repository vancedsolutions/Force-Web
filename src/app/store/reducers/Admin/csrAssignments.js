import { GET_CSR_ASSIGNMENTS } from "../../types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_CSR_ASSIGNMENTS:
      return action.payload;
    default:
      return state;
  }
};
