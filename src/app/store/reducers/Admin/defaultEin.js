import {GET_DEFAULT_EIN,SAVE_DEFAULT_EIN} from "../../types"

const initialState = {};
const DefaultEinReducer = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_DEFAULT_EIN:{
            state=action.payload;
            return state;
        }
      
        case SAVE_DEFAULT_EIN:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default DefaultEinReducer;