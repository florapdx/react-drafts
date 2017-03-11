import React, { PropTypes, Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { SUPPORTED_DOCUMENT_TYPES } from '../../../constants/file';
import Modal from '../../shared/modal';
import InputControls from './controls';

/*
 * Document upload/embed input.
 * Has two main user-flow states:
 * 1. user uses one of the inputs to add a file via drag-and-drop or upload.
 * 2. views preview and accepts or rejects file.
 * 3. accepting closes inputs; rejecting allows user to continue or close out
 *    via modal close link.
 */
class DocumentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      captionValue: '',
      error: null
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /*
   * Supports single file upload.
   * If browser supports FileReader, we'll try to show
   * a preview by reading the file to data url.
   * Otherwise, we'll just show the file name.
   */
  handleDrop(acceptedFiles, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length) {
      this.setState({
        error: "We're sorry, there was an upload error. Please try again."
      });
    } else {
      const file = acceptedFiles[0];

      if (window.FileReader) {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          file.src = reader.result;
          this.setState({ file });
        }, false);

        reader.readAsDataURL(file);
      } else {

      }
    }
  }

  handleCaptionChange(event) {
    this.setState({ captionValue: event.target.value });
  }

  handleConfirm() {
    const { blockType, onFileUpload, onAddDocument } = this.props;
    const { file, captionValue } = this.state;

    onFileUpload(file).then(resp => {
      onAddDocument(blockType, { file, caption: captionValue });
    });
  }

  handleCancel() {
    this.setState({ file: null, captionValue: '' });
  }

  render() {
    const { file, captionValue, error } = this.state;

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input document">
          {
            file ? ([
              <div key="preview" className="csfd-content-editor__input-preview">
                <a className="upload-name" href={file.src}>{file.name}</a>
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
                confirmText="Add File"
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
              />
            ]) : (
              <div className="csfd-content-editor__input-ui">
                <ReactDropzone
                  className="dropzone"
                  multiple={false}
                  accept={SUPPORTED_DOCUMENT_TYPES}
                  onDrop={this.handleDrop}
                >
                  <div className="csfd-content-editor__input-dropzone">
                    <span>Drag file or click to upload (pdf, docx, xls, txt)</span>
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

DocumentInput.propTypes = {
  blockType: PropTypes.string,
  onFileUpload: PropTypes.func,
  onAddDocument: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default DocumentInput;
