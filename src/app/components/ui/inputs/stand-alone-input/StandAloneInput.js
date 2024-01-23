import React, { useState } from "react";

const StandAloneInput = props => {
  let [focused, setFocused] = useState(false);
  return (
    <div className="__std_input_wrpr small" style={{ height: props.height }}>
      <label
        className={`ttcaps ${
          focused || (props.value && String(props.value).length) ? "dirty" : ""
        }`}
        htmlFor={props.id}
      >
        {props.label}
      </label>
      <input
        type="text"
        name={props.name}
        id={props.id}
        value={props.value}
        onChange={e =>
          props.change(
            e.target.value,
            props.field,
            props.i,
            props.locationIndex
          )
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export default StandAloneInput;
