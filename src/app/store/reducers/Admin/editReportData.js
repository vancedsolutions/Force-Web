import {EDIT_CLIENT_DATA}  from '../../types'

const initialState = {};

const EditCLientData = (state = initialState, action) => {
    switch (action.type) {
        case EDIT_CLIENT_DATA:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default EditCLientData;
