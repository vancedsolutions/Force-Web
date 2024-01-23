import { NO_PAYROLL_ACTIVITY } from "../../types";

const initialState = {};
const NoPayrollActivityReducer = (state = initialState, action) => {

    if (action.type === NO_PAYROLL_ACTIVITY) return action.payload;
    return state;
}

export default NoPayrollActivityReducer;
