import React, { useEffect, useState } from "react";
import StandAloneInput from "../../../../../../components/ui/inputs/stand-alone-input/StandAloneInput";
//import {  setCertifiedECS  } from "../../../../../../../../store/actions";
import Axios from "axios";
const RateTableId = (props) => {
  const [earningCodes, updateEarningCodes] = useState({});
  const [editForm, setEditForm] = useState(true);

  const getSavedEarningsCodes = async () => {

    let ec = await Axios.post(`/api/certified-payroll/earnings-codes/${props.reportParams.reportSettingsTab.isSelectedRowData.companyId}`).catch(e => e);
    return ec && ec.data;
  }

  useEffect(() => {
    async function getData() {
      const savedEarningCodes = await getSavedEarningsCodes();
      updateEarningCodes(savedEarningCodes);
    }
    getData();
  }, []);

  /* function updateRateTableId(ec, val) {
    return Object.assign(ec, { rateTableId: val });
  } */
  const handleChange = (e) => {
    updateEarningCodes({
      ...earningCodes,
      rateTableId: e
    });
  };

  const postUpdatedRateTableId = async () => {
    setEditForm(!editForm)
    return Axios.post("api/certified-payroll/earnings-codes", earningCodes).catch(e => e);

  }

  const EditReportId = () => {
    setEditForm(!editForm)
  }

  return (

    <div className="ec_setup_cntnt reg ">
      {editForm ? (
        <div className="reportId d-flex align-items-center justify-content-between">

          <div className="reportIdField repordIDCS_wd_100">
            <p className="repordIDCS">
              {earningCodes.rateTableId}
            </p>
          </div>

          <div className="reportIdField">
            <button className="btn reportBtn"
              onClick={EditReportId}
            >
              Edit
            </button>
          </div>


        </div>

      ) : (

        <div className="SavedReports reportId df align-items-center justify-content-between margin-top-10">
          <div className="input_line ssD_fiels">
            <StandAloneInput
              value={earningCodes.rateTableId}
              change={handleChange}
              id="rprt_inpt"
            ></StandAloneInput>

          </div>

          <button className="btn reportBtn"
            onClick={postUpdatedRateTableId}
          >
            Save
          </button>
        </div>
      )}


    </div>
  );
};
export default RateTableId;
