import React, { PropTypes } from 'react';

function InputControls({ confirmText, onCancel, onConfirm }) {
  return (
    <div className="controls">
      <button className="cancel" onClick={onCancel}>Cancel</button>
      <button className="confirm" onClick={onConfirm}>{confirmText}</button>
    </div>
  );
}

InputControls.propTypes = {
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default InputControls;
