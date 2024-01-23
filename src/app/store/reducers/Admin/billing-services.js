import {GET_BILLING_SERVICES,UPDATE_BILLING_SERVICES} from "../../types";

const initialState = {};
const BillingServicesR = (state = initialState, action) => {
    switch (action.type) {
        case GET_BILLING_SERVICES:{
            state=action.payload;
            return state;
        }
        case UPDATE_BILLING_SERVICES:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default BillingServicesR;