import {ADD_PURCHARE_ORDER,GET_PURCHARE_ORDER,UPDATE_PURCHARE_ORDER} from "../../types";

const initialState = {};
const PurchasedOrderR = (state = initialState, action) => {
    switch (action.type) {
        case GET_PURCHARE_ORDER:{
            state=action.payload;
            return state;
        }
        case ADD_PURCHARE_ORDER:{
            state=action.payload;
            return state;
        }
        case UPDATE_PURCHARE_ORDER:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default PurchasedOrderR;