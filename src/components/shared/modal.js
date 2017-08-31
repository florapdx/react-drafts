import React from 'react';
import PropTypes from 'prop-types';

function Modal({ children, onCloseClick }) {
  return (
    <div className="drafts-editor__modal">
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
