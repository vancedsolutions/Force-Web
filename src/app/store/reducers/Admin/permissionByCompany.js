import { GET_PERMISSION_BY_COMPANY } from "../../types";

const initialState = {};
const PermissionByCompanyReducer = (state = initialState, action) => {

    if (action.type === GET_PERMISSION_BY_COMPANY) {
        state = action.payload
    };
    return state;
};

export default PermissionByCompanyReducer;