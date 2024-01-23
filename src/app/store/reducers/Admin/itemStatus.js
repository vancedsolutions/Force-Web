

import {ITEMS_STATUS} from "../../types"

const initialState = {};
const ItemStatusR = (state = initialState, action) => {
    switch (action.type) {
        case ITEMS_STATUS:{
            state=action.payload;
            return state;
        }
     
        default: return state;
    }
}

export default ItemStatusR;