import React, { PropTypes, Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { TOOLBAR_DEFAULTS } from '../../../utils/toolbar';
import Modal from '../../shared/modal';

/*
 * Photo upload/embed input.
 * Has two main user-flow states:
 * 1. user uses one of the inputs to add a photo - either pasting a link,
 *    drag-and-drop image, or upload.
 * 2. views preview and accepts or rejects image.
 * 3. accepting closes inputs; rejecting allows user to continue or close out
 *    via modal close link.
 */
class PhotoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      srcValue: '',
      error: null
    };

    this.handlePasteLink = this.handlePasteLink.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
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
        error: "We're sorry, there was an upload error. Please try again."
      });
    } else {
      this.setState({
        file: acceptedFiles[0],
        srcValue: ''
      });
    }
  }

  handleConfirm() {
    const { blockType, onFileUpload, onAddPhoto } = this.props;
    const { file, src } = this.state;

    if (file) {
      // @TODO: verify approach
      // Get the stored file source
      onFileUpload(file).then(resp => {
        onAddPhoto(blockType, { src: resp.src });
      });
    } else {
      onAddPhoto(blockType, { src: srcValue });
    }
  }

  handleCancel() {
    this.setState({
      file: null,
      srcValue: ''
    });
  }

  render() {
    const { file, srcValue, error } = this.state;

    // Render preview for file upload or pasted link
    const preview = (file || srcValue) && ([
      <div key="preview" className="csfd-content-editor__input-preview">
        {
          file ? (
            <div>
              <img src={file.preview} alt={file.name} />
              <p>{file.name}</p>
            </div>
          ) : (
            <div>
              <img src={srcValue} />
            </div>
          )
        }
      </div>,
      <div key="controls" className="csfd-content-editor__input-controls">
        <button className="cancel" onClick={this.handleCancel}>Cancel</button>
        <button className="confirm" onClick={this.handleConfirm}>Add Photo</button>
      </div>
    ]);

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input photo">
          {
            preview ? preview : (
              <div className="csfd-content-editor__input-ui">
                <input
                  className="paste-image-link"
                  value={srcValue}
                  placeholder="Paste an image link"
                  onChange={this.handlePasteLink}
                />
                <div className="separator">or</div>
                <ReactDropzone
                  className="dropzone"
                  multiple={false}
                  onDrop={this.handleDrop}
                >
                  <div className="csfd-content-editor__input-dropzone">
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
