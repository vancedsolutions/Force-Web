import { GET_WAGE_RATE_LOCATIONS } from "../../types";

const initialState = {};
const wageRateLocationsR = (state = initialState, action) => {
    switch (action.type) {
       
        case GET_WAGE_RATE_LOCATIONS:{
            state=action.payload;
            return state;
        }
       
        default: return state;
    }
}

export default wageRateLocationsR;