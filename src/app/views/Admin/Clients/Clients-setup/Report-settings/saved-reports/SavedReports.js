import React, { useState, useEffect } from "react";

// import "./Deductions.scss";
import Axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../../../../../components/loader/Loader";
const WPSavedReports = (props) => {
  const user = useSelector((state) => props['reportParams'].USER);

  const [accrualsReportId, updateAccrualsReportId] = useState();
  const [loading, setLoading] = useState();
  const [editForm, setEditForm] = useState(true);

  const populate = async () => {
    setLoading(true);

    let dc = await Axios.post(
      `api/wage-parity/saved-earnings-codes/?companyId=${props['reportParams'].reportSettingsTab.isSelectedRowData.companyId}`,
    );

    updateAccrualsReportId(dc.data.accrualsReportId);

    setLoading(false);
  };

  useEffect(() => {

    populate();

    // eslint-disable-next-line
  }, []);
  const postUpdatedSavedReport = async () => {
    Axios.post("api/wage-parity/earnings-codes", {
      accrualsReportId,
      companyId: props['reportParams'].reportSettingsTab.isSelectedRowData.companyId,
    })
    setEditForm(!editForm)
  }
  const EditReportId = () => {
    setEditForm(!editForm)
  }
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (

        <>
          {editForm ? (
            <div className="WPSavedReports reportId df align-items-center justify-content-between">
              <div className="reportIdField repordIDCS_wd_100">
                <p className="repordIDCS">
                  {accrualsReportId}
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
            <div className="WPSavedReports reportId df align-items-center justify-content-between">
              <div className="reportIdField" style={{ marginRight: '10px', width: '100%' }}>
                <input
                  type="text"
                  value={accrualsReportId}
                  onChange={(e) => updateAccrualsReportId(e.target.value)}
                />
              </div>

              <div className="reportIdField">
                <button className="btn reportBtn"
                  onClick={postUpdatedSavedReport}

                >
                  Save
                </button>
              </div>

            </div>

          )}

        </>


      )}
    </>
  );
};

export default WPSavedReports;
