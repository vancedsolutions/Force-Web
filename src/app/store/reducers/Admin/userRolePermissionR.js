import { USER_ROLE_PERMISSION } from '../../types'

const initialState = {};

const UserRolePermissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_ROLE_PERMISSION:
            state = action.payload;
            return state;

        default: return state;
    }
}


export default UserRolePermissionReducer;