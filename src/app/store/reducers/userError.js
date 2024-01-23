import {SET_USER_ERROR} from "../types";

const initialState = {};
const UserErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_ERROR: {
            state = action.payload;
            return state;
        }
     
       
        default: return state;
    }
}

export default UserErrorReducer;
