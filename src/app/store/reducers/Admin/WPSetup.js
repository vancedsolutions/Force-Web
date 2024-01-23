import { GET_WP_SETUP } from "../../types";

const initialState = {};
const WPSetupR = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_WP_SETUP:{
            state=action.payload;
            return state;
        }
       
        default: return state;
    }
}

export default WPSetupR;