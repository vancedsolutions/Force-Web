import {
    COST_CENTER_MAPPING,
    COST_CENTER,
    LOCATION_CENTER_BY_COST_CENTER,
    UPDATE_LOCATION_CENTER,
    DEFAULT_COST_CENTER,
    DEFAULT_COST_CENTER_BY_COMPANY,
    COST_CENTER_BY_COMPANY_CODE,
    GET_COST_CENTERS
} from "../../types";

const initialState = {};
const CostCenterReducer = (state = initialState, action) => {
    if ([COST_CENTER_MAPPING,
        COST_CENTER,
        LOCATION_CENTER_BY_COST_CENTER,
        UPDATE_LOCATION_CENTER,
        DEFAULT_COST_CENTER,
        DEFAULT_COST_CENTER_BY_COMPANY,
        COST_CENTER_BY_COMPANY_CODE,
        GET_COST_CENTERS].includes(action.type)) {
        return { ...state, [action.type]: action.payload }
    }
    return state;
    /*  switch (action.type) {
         case COST_CENTER_MAPPING: {
             // state = { ...state, COST_CENTER_MAPPING: action.payload };
             return { ...state, COST_CENTER_MAPPING: action.payload };
         }
         case COST_CENTER: {
             // state = action.payload;
             return { ...state, costCenters: action.payload };
         }
         case LOCATION_CENTER_BY_COST_CENTER: {
             state = action.payload;
             return state;
         }
         case UPDATE_LOCATION_CENTER: {
             state = action.payload;
             return state;
         }
         case DEFAULT_COST_CENTER: {
 
             return { ...state, DEFAULT_COST_CENTER: action.payload }
         }
         case DEFAULT_COST_CENTER_BY_COMPANY: {
             return { ...state, DEFAULT_COST_CENTER_BY_COMPANY: action.payload }
         }
         case COST_CENTER_BY_COMPANY_CODE: {
             state = action.payload;
             return state;
         }
         case GET_COST_CENTERS: {
 
             state = action.payload;
             return state;
         }
         default:
             return state;
     } */
}

export default CostCenterReducer;