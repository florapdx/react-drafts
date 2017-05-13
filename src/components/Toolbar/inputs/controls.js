import React from 'react';
import PropTypes from 'prop-types';

function InputControls({ confirmText, onCancel, onConfirm }) {
  return (
    <div className="controls">
      <button
        className="cancel"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="confirm"
        type="button"
        onClick={onConfirm}
      >
        {confirmText}
      </button>
    </div>
  );
}

InputControls.propTypes = {
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default InputControls;
