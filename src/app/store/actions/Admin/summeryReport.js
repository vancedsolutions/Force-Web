import axios from "axios";
import {API} from "../../../utils/api";


export const getSummeryReport =async()=>{
    let response = await axios.post(API.getSummeryReport);
            return response.data||[]
        
     
}
    