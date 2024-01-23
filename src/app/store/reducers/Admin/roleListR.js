import {ROLE_LIST}  from '../../types'

const initialState = {};

const RoleListReducer = (state = initialState, action) => {
    switch (action.type) {
        case ROLE_LIST:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default RoleListReducer;