

import {GET_EXPIRATION_DATE,ADD_EXPIRATION_DATE} from "../../types"

const initialState = {};
const WarrantyExpirationR = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EXPIRATION_DATE:{
            state=action.payload;
            return state;
        }
        case GET_EXPIRATION_DATE:{
            state=action.payload;
            return state;
        }
     
        default: return state;
    }
}

export default WarrantyExpirationR;