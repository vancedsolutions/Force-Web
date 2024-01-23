import {TAX_COLLECTIONS} from "../../types";

const initialState = {};
const TaxCollectionReducer = (state = initialState, action) => {
    
    switch (action.type) {
       
        case TAX_COLLECTIONS:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default TaxCollectionReducer;