import {ORDER_ID} from "../../types"

const initialState = {};
const OrderIdR = (state = initialState, action) => {
    switch (action.type) {
        case ORDER_ID:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default OrderIdR;