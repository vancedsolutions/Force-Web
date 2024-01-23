import { GET_ANNUAL_BILLING_SETTINGS, UPDATE_ANNUAL_BILLING_SETTINGS } from "../../types";
const actionTypes = [GET_ANNUAL_BILLING_SETTINGS, UPDATE_ANNUAL_BILLING_SETTINGS];

export default (state = {}, action) => {
    if (actionTypes.includes(action.type)) {
        return {
            ...state,
            [action.type]: action.payload
        };
    }
    return state;
};