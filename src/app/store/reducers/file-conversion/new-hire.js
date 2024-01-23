import { NEW_HIRE } from "../../types";

const NewHireReducer = (state = {}, action) => {
    if (action.type === NEW_HIRE)
        return action.payload;
    return state;
};
export default NewHireReducer;