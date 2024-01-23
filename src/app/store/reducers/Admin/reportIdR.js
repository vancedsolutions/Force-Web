import {REPORT_ID}  from '../../types'

const initialState = {};

const ReportIdReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPORT_ID:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default ReportIdReducer;
