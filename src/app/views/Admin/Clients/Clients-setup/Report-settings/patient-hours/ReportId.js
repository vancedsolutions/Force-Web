import React, { useState, useEffect } from "react";
import { saveReportId, getReportId } from "../../../../../../store/actions";
import { connect } from "react-redux";

const ReportIdView = (props) => {
  const [reportIDInputValue, updateReportIDInputValue] = useState("");
  const [coordinatorReportIDInputValue, updateCoordinatorReportIDInputValue] = useState("");
  const [editForm, setEditForm] = useState(true);

  const save = async () => {
    const payload = {
      payrollReportID: reportIDInputValue,
      coordinatorReportID: coordinatorReportIDInputValue,
    }
    await props.saveReportId(props.EDIT_CLIENT_DATA?._id, payload)
    setEditForm(!editForm)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await props.getReportId(props.EDIT_CLIENT_DATA?._id);

  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let reportInfo = await props.report_ID;
    if (reportInfo.length) {
      updateReportIDInputValue(reportInfo[0]?.payrollReportID);
      updateCoordinatorReportIDInputValue(reportInfo[0]?.coordinatorReportID);

    } else {
      updateReportIDInputValue(reportInfo.payrollReportID);
      updateCoordinatorReportIDInputValue(reportInfo.coordinatorReportID);
    }
    return (() => {
    })

  }, [props.report_ID])

  const EditReportId = () => {
    setEditForm(!editForm)
  }

  return (
    <>
      {editForm ? (

        <div className="reportId df align-items-center justify-content-between">
          <div className="reportIdField repordIDCS_wd">
            <p className="repordIDCSs">
              <input type="text" placeholder="Payroll Report ID" readonly="readonly" value={reportIDInputValue} />
            </p>
          </div>
          <div className="reportIdField repordIDCS_wd">
            <p className="repordIDCSs">
              <input type="text" placeholder="Coordinator Report ID" readonly="readonly" value={coordinatorReportIDInputValue} />
            </p>
          </div>
          <div className="reportIdField">
            <button className="btn reportBtn" onClick={EditReportId}  >Edit</button>
          </div>
        </div>

      ) : (
        <div className="reportId df align-items-center justify-content-between">
          <div className="reportIdField repordIDCS_wd">
            <input type="text" placeholder="Payroll Report ID" value={reportIDInputValue} onChange={e => updateReportIDInputValue(e.target.value)} />
          </div>
          <div className="reportIdField repordIDCS_wd">
            <input type="text" placeholder="Coordinator Report ID" value={coordinatorReportIDInputValue} onChange={e => updateCoordinatorReportIDInputValue(e.target.value)} />
          </div>
          <div className="reportIdField">
            <button className="btn reportBtn" onClick={save} disabled={!reportIDInputValue, !coordinatorReportIDInputValue} >Save</button>
          </div>
        </div>

      )}

    </>
  );
};
const mapStateToProps = ({ USER, report_ID }) => ({ USER, report_ID });
export default connect(mapStateToProps, { saveReportId, getReportId })(ReportIdView);

