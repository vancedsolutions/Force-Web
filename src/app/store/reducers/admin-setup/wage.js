import {GET_COUNTRIES} from "../../types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_COUNTRIES:
      return action.payload;
    default:
      return state;
  }
};