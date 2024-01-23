import {ALL_USERS}  from '../../types'

const initialState = {};

const Users = (state = initialState, action) => {
    switch (action.type) {
        case ALL_USERS:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default Users;