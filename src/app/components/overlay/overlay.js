import React from "react";

// imort scss
import "./overlay.css";

export const Overlay = props => (
  <div className="__overlay" style={{ zIndex: props.zIndex }} />
);
