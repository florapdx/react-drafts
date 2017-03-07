import React, { PropTypes, Component } from 'react';
import Modal from '../shared/modal';
import ReactDropzone from 'react-dropzone';

class PhotoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      errors: null
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleDrop(acceptedFiles, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length) {
      this.setState({
        errors: "We're sorry, there was an upload error. Please try again."
      });
    } else {
      this.setState({ file: acceptedFiles[0] });
    }
  }

  handleConfirm() {
    this.props.onAddPhoto(this.state.file);
  }

  handleCancel() {
    this.setState({ file: null });
  }

  render() {
    const { file } = this.state;
    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input photo">
          {
            file ? ([
              <div key="preview" className="csfd-content-editor__input-preview">
                <img src={file.preview} alt={file.name} />
                <p>{file.name}</p>
              </div>,
              <div key="controls" className="csfd-content-editor__input-controls">
                <button className="cancel" onClick={this.handleCancel}>Cancel</button>
                <button className="confirm" onClick={this.handleConfirm}>Add Photo</button>
              </div>
            ]) : (
              <ReactDropzone className="dropzone" multiple={false} onDrop={this.handleDrop}>
                <div className="csfd-content-editor__input-dropzone">
                  <span>Drag file or click to upload</span>
                </div>
              </ReactDropzone>
            )
          }
        </div>
      </Modal>
    );
  }
}

PhotoInput.propTypes = {
  onAddPhoto: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default PhotoInput;
