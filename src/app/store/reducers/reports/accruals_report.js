import {GET_ACCRUALS_REPORT} from "../../types";

const initialState = {};
const GetAccrualsReportR = (state = initialState, action) => {
    switch (action.type) {
   
        case GET_ACCRUALS_REPORT:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default GetAccrualsReportR;
