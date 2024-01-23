import React, { Component } from "react";
import ReactDOM from "react-dom";

// import scss
 import "./style.scss";
import { Overlay } from "../overlay/overlay";

class Portal extends Component {
  constructor(props) {
    super(props);
    this.modalRoot = document.getElementById("root");
    this.el = document.createElement("div");
   
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }
  render() {
    const { height, width } = this.props;

    return ReactDOM.createPortal(
      <div>
        <div
          className="__pp_popup"
          style={{
            height,
            width,
            maxWidth: this.props.maxWidth,
            zIndex: this.props.zIndex
          }}
        >
          {!this.props.hideHeader && (
            <div className="df __pp_header">
              <p className="ttuc fs16">{this.props.title}</p>

              <div
                className="df acc mla __pp_closer"
                onClick={() => {
                  this.props.close();
                }}
              ></div>
            </div>
          )}

          {this.props.children}
        </div>
        <Overlay zIndex={this.props.zIndex - 1}></Overlay>
      </div>,
      this.el
    );
  }
}

export default Portal;
