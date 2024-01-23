import {GET_WAGE_LIST,DELETE_WAGE,ADD_WAGE,UPDATE_WAGE,UPDATE_PERVIOUS_DATE} from "../../types";

const initialState = {};
const WageReducer = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_WAGE_LIST:{
            state=action.payload;
            return state;
        }
        case ADD_WAGE:{
            state=action.payload;
            return state;
        }
        case DELETE_WAGE:{
            state=action.payload;
            return state;
        }
        case UPDATE_WAGE:{
            state=action.payload;
            return state;
        }
        case UPDATE_PERVIOUS_DATE:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default WageReducer;