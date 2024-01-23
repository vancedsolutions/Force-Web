import React, { useState, useEffect } from "react";
import Select from "react-select";
import _ from "lodash";

import "./Deductions.scss";
import { get, post } from "axios";
import { useSelector } from "react-redux";
import Loader from "../../../../../../components/loader/Loader";

const DeductionsView = (props) => {

  const { USER, savedEarningsCodes } = props.reportParams.reportSettingsTab;
  const { companyId } = props.reportParams.reportSettingsTab.isSelectedRowData;

  const [deductionsList, updateDeductionsList] = useState([]);
  const [selectedDeductionsList, updateSelectedDeductionsList] = useState([]);
  const [loading, setLoading] = useState();

  const populateList = async () => {
    setLoading(true);

    let d = await get(`api/deduction-codes/deductions-list/${companyId}`)

    updateDeductionsList(d.data || []);

    let dc = savedEarningsCodes;
    updateSelectedDeductionsList(dc.data && dc.data.dc || []);

    setLoading(false);
  };

  const updateSelected = (option) => {
    if (deductionsList.length) {
      const index = deductionsList.indexOf(option);
      deductionsList.splice(index, 1);
      updateDeductionsList(deductionsList);
      return updateSelectedDeductionsList([
        ...selectedDeductionsList,
        { ...option, negate: false },
      ]);
    }

  };

  const removeFromSelected = (itm) => {
    let itmCopy = _.cloneDeep(itm);
    updateDeductionsList([...deductionsList, itmCopy]);
    let copy = _.cloneDeep(selectedDeductionsList);
    let index = _.findIndex(copy, { label: itmCopy.label });
    copy.splice(index, 1);

    return updateSelectedDeductionsList([...copy]);
  };

  useEffect(() => {
    if (USER) {
      populateList();
    }
    // eslint-disable-next-line
  }, [USER]);

  const updateNegate = (value, idx) => {
    let copy = _.cloneDeep(selectedDeductionsList);
    copy[idx].negate = value;
    return updateSelectedDeductionsList(copy);
  };
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="ddctns_page df align-items-center justify-content-between">
          <div className="dd_wrpr">
            <Select
              placeholder="Select"
              options={deductionsList}
              //   value={this.state.ccIndex}
              onChange={updateSelected}
            />
          </div>
          {selectedDeductionsList.map((selectedOption, idx) => (
            <div className="df acsa ddctn_wrpr" key={idx}>
              {selectedOption.label}

              <div className="chbx_sec_wrpr">
                <input
                  type="checkbox"
                  id={`negate_${idx + 1}`}
                  checked={selectedOption.negate}
                  onChange={(e) => updateNegate(e.target.checked, idx)}
                ></input>
                <label htmlFor={`negate_${idx + 1}`}>Negate</label>
              </div>
              <p
                className="mla"
                onClick={() => removeFromSelected(selectedOption)}
              >
                delete
              </p>
            </div>
          ))}
          <button className="btn reportBtn" disabled={!selectedDeductionsList.length}
            onClick={() =>
              post("api/wage-parity/earnings-codes", {
                dc: selectedDeductionsList,
                companyId: companyId,
              })
            }
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default DeductionsView;
