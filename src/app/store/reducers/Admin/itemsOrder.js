import {ADD_ITEM_ORDER,GET_ITEMS_ORDER,UPDATE_ITEM_ORDER,ORDER_ID} from "../../types"

const initialState = {};
const ItemsOrderR = (state = initialState, action) => {
    switch (action.type) {
        case GET_ITEMS_ORDER:{
            state=action.payload;
            return state;
        }
        case ADD_ITEM_ORDER:{
            state=action.payload;
            return state;
        }
        case UPDATE_ITEM_ORDER:{
            state=action.payload;
            return state;
        }
        case ORDER_ID:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default ItemsOrderR;