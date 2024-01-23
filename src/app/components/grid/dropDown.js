import React, { useState, useEffect } from "react";
import select from 'react-select';
import { UpdateBillingServices } from "../../store/actions";
import { connect } from "react-redux";

export const DropDownRender = (props) => {
  const [selectedVal, setSelectedVal] = useState("");

  const onValueChange = (e) => {
    let data = props.data;
    data.billingCategory = e.target.value
    props.onChange(data);
    setSelectedVal(data.billingCategory)
  }

  useEffect(() => {
    let data = props.data;
    setSelectedVal(data?.billingCategory || "");
  })

  return (
    <div className="agDropDown">
      {props.node.group === false ? <>
        <select className="roleSelect" value={selectedVal} onChange={onValueChange} options={props.optionsList}>
          <option value="" disabled selected hidden>choose category</option>
          {props.optionsList.map(el => (
            <option value={el}>{el}</option>
          ))}
        </select>
      </> : null}
    </div>
  );
}

const mapStateToProps = ({ BillingServices }) => ({ BillingServices });
export default connect(mapStateToProps, { UpdateBillingServices })(DropDownRender);