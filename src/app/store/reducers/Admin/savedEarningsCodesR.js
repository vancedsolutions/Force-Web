import { GET_SAVED_EARNINGS_CODES, GET_SAVED_EARNINGS_CODES_CONVERSION_TOOL} from "../../types";

const initialState = {};
const savedEarningsCodes = (state = initialState, action) => {
  switch (action.type) {
    case GET_SAVED_EARNINGS_CODES: {
      return action.payload;
    }case GET_SAVED_EARNINGS_CODES_CONVERSION_TOOL: {
      return action.payload;
    }
    default:
      return state;
  }
};
export default savedEarningsCodes;