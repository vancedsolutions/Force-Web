import { GET_BG_TASKS } from "../../types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_BG_TASKS:
      return action.payload;
    default:
      return state;
  }
};
