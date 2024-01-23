import {ADD_ROLE}  from '../../types'

const initialState = {};

const RoleReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ROLE:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default RoleReducer;