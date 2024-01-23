import {BANK_CONVERSION} from "../../types";

const initialState = {};
const BankReducer = (state = initialState, action) => {
    
    switch (action.type) {
       
        case BANK_CONVERSION:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default BankReducer;