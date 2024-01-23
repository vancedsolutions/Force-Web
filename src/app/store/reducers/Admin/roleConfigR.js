import {ROLE_CONFIG}  from '../../types'

const initialState = {};

const RoleConfigReducer = (state = initialState, action) => {
    switch (action.type) {
        case ROLE_CONFIG:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default RoleConfigReducer;