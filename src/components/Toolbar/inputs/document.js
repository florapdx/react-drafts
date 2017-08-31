import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import { SUPPORTED_DOCUMENT_TYPES } from '../../../constants/file';
import Modal from '../../shared/modal';
import InputControls from './controls';

/*
 * Document upload/embed input.
 * Has two main user-flow states:
 * 1. user uses one of the inputs to add a file via drag-and-drop or upload.
 * 2. views preview and confirms or cancels file upload.
 * 3. accepting uploads and embeds file, and closes input;
 *    rejecting allows user to re-drop or quit.
 */
const ERROR_MSG = 'We\'re sorry, there was an upload error. Please try again.';

class DocumentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      captionValue: '',
      error: null
    };

    const { currentEntity } = this.props;
    if (currentEntity) {
      const data = currentEntity.entity.getData();
      this.state = {
        file: {
          src: data.src,
          name: data.name
        },
        captionValue: data.caption
      };
    }

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
        error: ERROR_MSG
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
        this.setState({ file });
      }
    }
  }

  handleCaptionChange(event) {
    this.setState({
      captionValue: event.target.value
    });
  }

  handleConfirm() {
    const { blockType, currentEntity, onFileUpload, onAddDocument } = this.props;
    const { file, captionValue } = this.state;

    if (currentEntity) {
      onAddDocument(
        blockType,
        currentEntity,
        {
          ...currentEntity.entity.getData(),
          caption: captionValue
        }
      );
    } else {
      onFileUpload(file)
        .then(resp => {
          onAddDocument(
            blockType,
            currentEntity,
            {
              src: resp.src,
              name: resp.name,
              caption: captionValue
            }
          );
        })
        .catch(err => {
          this.setState({
            error: ERROR_MSG
          });
        });
    }
  }

  handleCancel() {
    this.setState({
      file: null,
      captionValue: ''
    });
  }

  render() {
    const { currentEntity } = this.props;
    const { file, captionValue, error } = this.state;

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="drafts-editor__input document">
          {
            file ? ([
              <div key="preview" className="preview">
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
                confirmText={currentEntity ? 'Update' : 'Add File'}
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
              />
            ]) : (
              <div className="add">
                <ReactDropzone
                  className="react-dropzone"
                  multiple={false}
                  accept={SUPPORTED_DOCUMENT_TYPES}
                  onDrop={this.handleDrop}
                >
                  <div className="dropzone">
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
  currentEntity: PropTypes.shape({}),
  onFileUpload: PropTypes.func,
  onAddDocument: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default DocumentInput;
