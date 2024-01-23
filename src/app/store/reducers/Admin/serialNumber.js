

import {GET_SERIAL_NUMBER} from "../../types"

const initialState = {};
const SerialNumberR = (state = initialState, action) => {
    switch (action.type) {
        case GET_SERIAL_NUMBER:{
            state=action.payload;
            return state;
        }
     
        default: return state;
    }
}

export default SerialNumberR;