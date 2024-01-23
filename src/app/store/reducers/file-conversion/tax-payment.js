import {TAX_PAYMENT} from "../../types";

const initialState = {};
const TaxPaymentReducer = (state = initialState, action) => {
    
    switch (action.type) {
       
        case TAX_PAYMENT:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default TaxPaymentReducer;