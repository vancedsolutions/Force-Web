import { DIRECT_DEPOSIT } from "../../types";

const DirectDepositReducer = (state = {}, action) => {
    if (action.type === DIRECT_DEPOSIT)
        return action.payload;
    return state;
};
export default DirectDepositReducer;