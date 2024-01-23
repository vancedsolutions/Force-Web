import { GET_CLIENT } from "../../types";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_CLIENT:
      return action.payload;
    default:
      return state;
  }
};
