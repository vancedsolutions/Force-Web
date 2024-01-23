import {GET_EXPORT_EARNING_CODE,EXPORT_EARNING_CODE} from "../../types";

const initialState = {};
const ExportEarningCode = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_EXPORT_EARNING_CODE: {
            
            state=action.payload;
            return state;
        }
            
        case EXPORT_EARNING_CODE: {
            
            state=action.payload;
            return state;
        }
                  
        default: return state;
    }
}

export default ExportEarningCode;