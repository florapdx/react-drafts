import React, { PropTypes, Component } from 'react';
import Modal from '../shared/modal';

class LinkInput extends Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleConfirm() {
    this.props.onAddLink(this.state.value);
  }

  handleCancel() {
    this.setState({ value: '' });
  }

  render() {
    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input link">
          <input
            value={this.state.value}
            placeholder="Paste or type link"
            onChange={this.handleChange}
          />
          <div className="csfd-content-editor__input-controls">
            <button className="cancel" onClick={this.handleCancel}>Cancel</button>
            <button className="confirm" onClick={this.handleConfirm}>Add link</button>
          </div>
        </div>
      </Modal>
    );
  }
}

LinkInput.propTypes = {
  onAddLink: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default LinkInput;
