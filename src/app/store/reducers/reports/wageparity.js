import {GET_WAGE_PARITY_REPORT} from "../../types";

const initialState = {};
const WageParityActivityReducer= (state = initialState, action) => {
    
    switch (action.type) {
       
        case GET_WAGE_PARITY_REPORT:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default WageParityActivityReducer;
