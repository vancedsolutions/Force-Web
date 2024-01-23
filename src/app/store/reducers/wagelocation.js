import {LOCATION_LIST} from "../types";

const initialState = {};
const WageLocationReducer = (state = initialState, action) => { 
    switch (action.type) {
       
        case LOCATION_LIST:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default WageLocationReducer;