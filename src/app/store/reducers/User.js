import { SET_USER, LOGOUT } from "../types";

const initialState = {};
const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            state = { ...state, ...action.payload };
            return state;
        }
        case LOGOUT: {
            state = initialState;
            return state
        }

        default: return state;
    }
}

export default UserReducer;
