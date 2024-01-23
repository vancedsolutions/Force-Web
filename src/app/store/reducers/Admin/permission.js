import { GET_PERMISSIONS, SAVE_PERMISSIONS, GET_ROLE_PERMISSIONS, CLIENT_PERMISSIONS } from "../../types";


const permissions = [GET_PERMISSIONS, SAVE_PERMISSIONS, GET_ROLE_PERMISSIONS, CLIENT_PERMISSIONS];
const PermissionReducer = (state = {}, action) => {
    if (permissions.includes(action.type)) return { ...state, [action.type]: action.payload };
    return state;
    /* switch (action.type) {

        case GET_PERMISSION: {
            state = action.payload;
            return state;
        }

        case SAVE_PERMISSIONS: {
            state = action.payload;
            return state;
        }
        default: return state;
    } */
}

export default PermissionReducer;