import { PATIENT_HOURS, COORDINATOR, EINS, SYNC_PH } from "../../types";

const initialState = {};
const PatientReducer = (state = initialState, action) => {
    if ([PATIENT_HOURS, COORDINATOR, EINS, SYNC_PH].includes(action.type)) {
        return { ...state, [action.type]: action.payload }
    }
    return state;
    /*  switch (action.type) {
 
         case PATIENT_HOURS: {
             state = action.payload;
             return state;
         }
         case COORDINATOR: {
             state = action.payload;
             return state;
         }
         case EINS: {
             state = action.payload;
             return state;
         }
         case SYNC_PH: {
             state = action.payload;
             return state;
         }
         default: return state;
     } */
}

export default PatientReducer;
