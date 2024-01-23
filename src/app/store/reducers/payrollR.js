import {GET_PAYROLL_DETAIL} from "../types";

const initialState = {};
const PayrollDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PAYROLL_DETAIL: {
            state = action.payload;
            return state;
        }
       
       
        default: return state;
    }
}

export default PayrollDetailReducer;
