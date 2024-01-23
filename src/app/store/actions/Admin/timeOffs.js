import axios from "axios";
import { API } from "../../../utils/api";

export const saveTimeOffs = async (payload) => {

    return await axios.post(API.saveTimeOffs(payload.company), payload).catch((e) => { console.log(e) });
};



export const getTimeOffs = async (companyId) => {

    let response = await axios.get(`api/accrual/get-time-offs/${companyId}`);
    return response.data || [];
}