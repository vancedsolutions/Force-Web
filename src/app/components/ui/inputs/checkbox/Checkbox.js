import React from "react";

//import scss
import "./Checkbox.scss";

const Checkbox = props => {
  //   const [checked, setChecked] = useState(props.checked);

  return (
    <div className="__checkbox">
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        className="dn"
        onChange={e => {
          props.clickAction(props.field, props.value, e.target.checked);
        }}
      />
      <label
        htmlFor={props.id}
        className={`lbl ${props.checked ? "checked" : ""}`}
      ></label>
    </div>
  );
};

export default Checkbox;
