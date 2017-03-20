import React, { PropTypes } from 'react';

function Modal({ children, onCloseClick }) {
  return (
    <div className="content-editor__modal">
      <button
        className="fa fa-times-circle"
        type="button"
        onClick={onCloseClick}
      />
      <div className="wrapper">
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  onCloseClick: PropTypes.func
};

export default Modal;
