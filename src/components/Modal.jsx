import React from "react";

const Modal = (props) => {
  return (
    <div className={"modal " + props.open}>
      <div>{props.text}</div>
    </div>
  );
};

export default Modal;
