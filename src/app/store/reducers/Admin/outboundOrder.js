import {ADD_OUTBOUND_ORDER,GET_OUTBOUND_ORDER,UPDATE_OUTBOUND_ORDER} from "../../types";

const initialState = {};
const OutboundOrderR = (state = initialState, action) => {
    switch (action.type) {
        case GET_OUTBOUND_ORDER:{
            state=action.payload;
            return state;
        }
        case ADD_OUTBOUND_ORDER:{
            state=action.payload;
            return state;
        }
        case UPDATE_OUTBOUND_ORDER:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default OutboundOrderR;