import axios from "axios";
import {
    API, MSG
} from "../../../utils";
import {
    GET_COST_CENTERS,
    COST_CENTER,
    COST_CENTER_MAPPING,
    LOCATION_CENTER_BY_COST_CENTER,
    UPDATE_LOCATION_CENTER,
    SET_ERROR,
    DEFAULT_COST_CENTER,
    DEFAULT_COST_CENTER_BY_COMPANY,
    COST_CENTER_BY_COMPANY_CODE
} from "../../types"
import ToastMessage from '../../../components/toast';

export const getCostCenter = (payload) => {
    return async (dispatch) => {
        await axios.post(API.costCenter, payload).then(response => {

            dispatch({
                type: COST_CENTER,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}

export const getLocationCenterByCostCenter = (centerId) => {
    return async (dispatch) => {
        await axios.get(API.getLocationCenterByCostCenter(centerId)).then(response => {
            dispatch({
                type: LOCATION_CENTER_BY_COST_CENTER,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}

export const getCostCenterMapping = (id, treeIndex, selected) => {
    return async (dispatch) => {
        await axios.post(API.costCenterMapping(id), { treeIndex, selected }).then(response => {
            dispatch({
                type: COST_CENTER_MAPPING,
                payload: response.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}

export const updateLocationCenter = (payload) => {
    return async (dispatch) => {
        await axios.put(API.updateLocationCenter, payload).then(response => {
            dispatch({
                type: UPDATE_LOCATION_CENTER,
                payload: response.data.data
            });
            ToastMessage({ type: MSG.SUCCESS, message: MSG.COMMONMSG });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}
export const setDefaultCostCenter = (payload) => {
    return async (dispatch) => {
        await axios.post(API.defaultCostCenter, payload).then(response => {
            dispatch({
                type: DEFAULT_COST_CENTER,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }

}
export const getDefaultCostCenterByCompany = (payload) => {
    return async (dispatch) => {
        await axios.post(API.defaultCostCenterByComponyShortCode, {
            companyShortName: payload
        }).then(response => {
            
            dispatch({
                type: DEFAULT_COST_CENTER_BY_COMPANY,
                payload: response.data.data
            });
        }).catch(e => {
            console.log(e);
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
            .then(response => {
                dispatch({
                    type: DEFAULT_COST_CENTER_BY_COMPANY,
                    payload: response.data.data
                });
            }).catch(e => {
                dispatch({
                    type: SET_ERROR,
                    payload: {
                        e,
                        error: true
                    }
                })
            })
    }
}

export const getCostCenterByCompanyCode = (payload) => {
    return async (dispatch) => {
        await axios.post(API.getCostCenterByCompanyCode, {
            companyShortName: payload
        }).then(response => {
            dispatch({
                type: COST_CENTER_BY_COMPANY_CODE,
                payload: response.data.data
            });
        }).catch(e => {
            dispatch({
                type: SET_ERROR,
                payload: {
                    e,
                    error: true
                }
            })
        })
    }
}

export const getCostCenterByTreeIndex = (index, clientId) => {
    return async (dispatch) => {
        await axios.post(`api/cost-centers/get-cost-center-api/${index}/${clientId}`, {})
            .then(response => {
                dispatch({
                    type: GET_COST_CENTERS,
                    payload: response.data.data,
                });
            });
    };
}

export const clearCostCenters = () => ({ type: GET_COST_CENTERS, payload: "" });