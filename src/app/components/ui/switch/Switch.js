import React from "react";

// import scss
import "./Switch.scss";

const Switch = props => {
  //   const [state, setState] = useState(props.value);
  return (
    <>
      <div className="__switch_wrpr">
        <label
          className={`${props.value ? "on" : ""}`}
          htmlFor={`swtch_${props.id}`}
        ></label>
        <input
          className="dn"
          value={props.value}
          checked={props.value}
          onChange={e => {
            props.switchAction(props.id, e.target.checked);
          }}
          type="checkbox"
          id={`swtch_${props.id}`}
        ></input>
      </div>
    </>
  );
};

export default Switch;
