import { COUNTY_WAGE, EARNING_CODE } from "../../types";

const initialState = {};
const ConversionToolReducer = (state = initialState, action) => {

    switch (action.type) {

        case COUNTY_WAGE: {
            state = action.payload;
            return state;
        }
        case EARNING_CODE: {
            state = action.payload;
            return state;
        }
        default: return state;
    }
}

export default ConversionToolReducer;