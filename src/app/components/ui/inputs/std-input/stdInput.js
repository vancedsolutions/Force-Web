import React, { useState } from "react";

// import scss
import "./stdInput.scss";

export const StdInput = ({ field, form, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className="__std_input_wrpr">
      <label
        htmlFor={props.id}
        className={`${form.values[field.name] || focus ? "dirty" : ""}`}
      >
        {props.label}
      </label>
      <input
        name={field.name}
        type={props.type}
        {...field}
        {...props}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      ></input>
      <p className={`__hint ${form.errors[field.name] ? "error" : ""}`}>
        {form.errors[field.name] && form.touched[field.name]
          ? form.errors[field.name]
          : props.hint}
      </p>
    </div>
  );
};
