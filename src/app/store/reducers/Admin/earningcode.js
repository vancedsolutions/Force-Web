import {GET_EARNINGS_CODES,GET_PAYROLL_EARNINGS_CODES} from "../../types";

const initialState = {};
const EarningCodeReducer = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_EARNINGS_CODES: {
            
            state=action.payload;
            return state;
        }
        case GET_PAYROLL_EARNINGS_CODES: {
            state=action.payload;
            return state;
            }
            
       
        default: return state;
    }
}

export default EarningCodeReducer;