import React, { PropTypes, Component } from 'react';
import Modal from '../shared/modal';

class VideoInput extends Component {
  constructor(props) {
    super(props);

    this.state = { embedCode: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    this.setState({ embedCode: event.target.value });
  }

  handleConfirm() {
    // Need to parse out info we need from embed html
    const { embedCode } = this.state;
    const data = {};
    debugger;
    this.props.onAddVideo(data);
  }

  handleCancel() {
    this.setState({ embedCode: '' });
  }

  render() {
    const { embedCode } = this.state;
    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input video">
          {
            embedCode ? ([
              <div className="csfd-content-editor__input-preview">
                <div dangerouslySetHTML={{__html: embedCode}} />
              </div>,
              <div className="csfd-content-editor__input-controls">
                <button className="cancel" onClick={this.handleCancel}>Cancel</button>
                <button className="confirm" onClick={this.handleConfirm}>Add link</button>
              </div>
            ]) : (
              <input
                value={this.state.value}
                placeholder="Paste video embed code (YouTube, etc)"
                onChange={this.handleChange}
              />
            )
          }
        </div>
      </Modal>
    );
  }
}

VideoInput.propTypes = {
  onAddVideo: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default VideoInput;
