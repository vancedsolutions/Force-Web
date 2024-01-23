import {GET_COMPANIES} from "../../types";

const initialState = {};
const CompaniesReducer = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_COMPANIES:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default CompaniesReducer;