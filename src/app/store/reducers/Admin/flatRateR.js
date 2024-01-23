import {MIN_WAGE_LOCATION_DATA}  from '../../types'

const initialState = {};

const FlatRateR = (state = initialState, action) => {
    switch (action.type) {
        case MIN_WAGE_LOCATION_DATA:
            state=action.payload;
            return state;
    
        default: return state;
    }
}


export default FlatRateR;
