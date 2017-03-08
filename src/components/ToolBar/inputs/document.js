import React, { PropTypes, Component } from 'react';
import ReactDropzone from 'react-dropzone';
import Modal from '../../shared/modal';

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
      error: null
    };

    this.handleDrop = this.handleDrop.bind(this);
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
      const reader = new FileReader();

      if (reader && reader.readAsDataURL) {
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

  handleConfirm() {
    const { blockType, onFileUpload, onAddDocument } = this.props;
    const { file } = this.state;

    onFileUpload(file).then(resp => {
      onAddDocument(blockType, { file });
    });
  }

  handleCancel() {
    this.setState({ file: null });
  }

  render() {
    const { file, error } = this.state;

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input document">
          {
            file ? ([
              <div key="preview" className="csfd-content-editor__input-preview">
                {
                  file.src &&
                    <iframe
                      src={file.src}
                      width="440px"
                      height="570px"
                      frameBorder="0"
                      allowFullScreen={false}
                    />
                }
                <p>{file.name}</p>
              </div>,
              <div key="controls" className="csfd-content-editor__input-controls">
                <button className="cancel" onClick={this.handleCancel}>Cancel</button>
                <button className="confirm" onClick={this.handleConfirm}>Add File</button>
              </div>
            ]) : (
              <div className="csfd-content-editor__input-ui">
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

DocumentInput.propTypes = {
  blockType: PropTypes.string,
  onFileUpload: PropTypes.func,
  onAddDocument: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default DocumentInput;
