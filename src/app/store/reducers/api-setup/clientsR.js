import { GET_CLIENTS } from "../../types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_CLIENTS:
      return action.payload;
    default:
      return state;
  }
};
