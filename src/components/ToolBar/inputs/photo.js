import React, { PropTypes, Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { SUPPORTED_PHOTO_TYPES } from '../../../constants/file';
import Modal from '../../shared/modal';
import InputControls from './controls';

/*
 * Photo upload/embed input.
 * Has two main user-flow states:
 * 1. user uses one of the inputs to add a photo - either pasting a link,
 *    drag-and-drop image, or upload.
 * 2. views preview and confirms or cancels image.
 * 3. confirming uploads and embeds photo, and closes inputs;
 *    rejecting allows user to continue or quit.
 */
const ERROR_MSG = "We're sorry, there was an upload error. Please try again.";

class PhotoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      srcValue: '',
      captionValue: '',
      error: null
    };

    this.handlePasteLink = this.handlePasteLink.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handlePasteLink(event) {
    this.setState({
      srcValue: event.target.value,
      file: null
    });
  }

  /*
   * Supports single image upload.
   */
  handleDrop(acceptedFiles, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length) {
      this.setState({
        error: ERROR_MSG
      });
    } else {
      this.setState({
        file: acceptedFiles[0],
        srcValue: ''
      });
    }
  }

  handleCaptionChange(event) {
    this.setState({
      captionValue: event.target.value
    });
  }

  handleConfirm() {
    const { blockType, onFileUpload, onAddPhoto } = this.props;
    const { file, srcValue, captionValue } = this.state;

    if (file) {
      // Get the stored file source
      onFileUpload(file)
        .then(resp => {
          onAddPhoto(blockType, {
            src: resp.src,
            caption: captionValue
          });
        })
        .catch(err => {
          this.setState({
            error: ERROR_MSG
          });
        });
    } else {
      onAddPhoto(blockType, {
        src: srcValue,
        caption: captionValue
      });
    }
  }

  handleCancel() {
    this.setState({
      file: null,
      srcValue: '',
      captionValue: '',
      error: ''
    });
  }

  render() {
    const { file, srcValue, captionValue, error } = this.state;

    // Render preview for file upload or pasted link
    const preview = (file || srcValue) && ([
      <div key="preview" className="preview">
        <img src={file ? file.preview : srcValue} alt={file ? file.name : ''} />
        <textarea
          className="add-caption"
          value={captionValue}
          placeholder="Add a caption (optional)"
          onChange={this.handleCaptionChange}
          maxLength={1000}
        />
      </div>,
      <InputControls
        key="controls"
        confirmText="Add Photo"
        onConfirm={this.handleConfirm}
        onCancel={this.handleCancel}
      />
    ]);

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="content-editor__input photo">
          {
            preview ? preview : (
              <div className="add">
                <input
                  className="paste-image-link"
                  value={srcValue}
                  placeholder="Paste an image link"
                  onChange={this.handlePasteLink}
                />
                <div className="separator">or</div>
                <ReactDropzone
                  className="react-dropzone"
                  multiple={false}
                  onDrop={this.handleDrop}
                >
                  <div className="dropzone">
                    <span>Drag file or click to upload</span>
                  </div>
                </ReactDropzone>
                { error && <p className="input-error">{error}</p> }
              </div>
            )
          }
        </div>
      </Modal>
    );
  }
}

PhotoInput.propTypes = {
  blockType: PropTypes.string,
  onFileUpload: PropTypes.func,
  onAddPhoto: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default PhotoInput;
