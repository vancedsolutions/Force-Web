import {LATE_PAYROLL,LATE_PAYROLL_DETAIL} from "../../types";

const initialState = {};
const LatePayrollReducer= (state = initialState, action) => {
    
    switch (action.type) {
       
        case LATE_PAYROLL:{
            state=action.payload;
            return state;
        }
        case LATE_PAYROLL_DETAIL: {
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default LatePayrollReducer;
