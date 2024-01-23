
import React, { useState, useEffect } from "react";
import { saveDefaultEIN } from "../../../../../../store/actions";
import { EinsHourAction } from "../../../../../../store/actions";
import { connect } from "react-redux";

const DefaultEins = (props) => {
  const [einsData, EinsListData] = useState([]);
  const [selectedEin, setEins] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEins()
  }, []);

  async function fetchEins() {
    const id = props.EDIT_CLIENT_DATA?._id;
    await props.EinsHourAction(id);
    let listEins = props.GET_PATIENT_HOUR.EINS;
    if (listEins?.defaultSelected?._id) {

      setEins(listEins?.defaultSelected?._id);
    } else {
      setEins(listEins?.records[0]?._id);
    }

    EinsListData(listEins?.records || [])
  }

  const handleChange = (e) => {
    setEins(e.target.value)
  }
  const save = async () => {
    let payload = {
      company: props.EDIT_CLIENT_DATA?.companyId,
      selectedEin
    }
    props.saveDefaultEIN(payload);
  }

  return (

    <div className="reportId df align-items-center justify-content-between">
      <div className="reportIdField">
        {/* <div className="setDefaultLabel">
        Set as default 
      </div> */}
        <select className="selectBox" style={{ marginRight: '15px' }} value={selectedEin} onChange={(e) => handleChange(e)}>
          {einsData.map((item, index) => (<option key={index} value={item._id}>{item.companyEIN}</option>))}
        </select>
      </div>
      <div className="reportIdField">
        <button className="btn reportBtn" onClick={save}>Save</button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ USER, GET_PATIENT_HOUR, EDIT_CLIENT_DATA }) => ({ USER, GET_PATIENT_HOUR, EDIT_CLIENT_DATA });
export default connect(mapStateToProps, { EinsHourAction, saveDefaultEIN })(DefaultEins);
