import {TEAM_SUPPORT_REGESTER} from "../../types";

const initialState = {};
const TeamSupportRegisterReducer = (state = initialState, action) => {
    switch (action.type) {
       
        case TEAM_SUPPORT_REGESTER:{
            state=action.payload;
            return state;
        }
        default: return state;
    }
}

export default TeamSupportRegisterReducer;