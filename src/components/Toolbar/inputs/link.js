import React, { PropTypes, Component } from 'react';
import ReactDropzone from 'react-dropzone';
import { SUPPORTED_DOCUMENT_TYPES } from '../../../constants/file';
import Modal from '../../shared/modal';
import InputControls from './controls';

const ERROR_MSG = 'We\'re sorry, there was an upload error. Please try again.';

class LinkInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linkValue: '',
      linkIsTargetBlank: false,
      textValue: this.props.linkText || '',
      file: null,
      error: null
    };

    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleLinkTextChange = this.handleLinkTextChange.bind(this);
    this.handleToggleTarget = this.handleToggleTarget.bind(this);

    this.handleDrop = this.handleDrop.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleLinkChange(event) {
    this.setState({ linkValue: event.target.value });
  }

  handleLinkTextChange(event) {
    this.setState({ textValue: event.target.value });
  }

  handleToggleTarget(event) {
    this.setState({
      linkIsTargetBlank: event.target.checked
    });
  }

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

  handleConfirm() {
    const { blockType, onFileUpload, onAddLink } = this.props;
    const {
      linkValue,
      linkIsTargetBlank,
      textValue,
      file
    } = this.state;

    if (file) {
      onFileUpload(file)
      .then(resp => {
        onAddLink(blockType, {
          url: resp.src,
          text: textValue || resp.name,
          target: linkIsTargetBlank
        });
      })
      .catch(err => {
        this.setState({
          error: ERROR_MSG
        });
      });
    } else {
      onAddLink(blockType, {
        url: linkValue,
        text: textValue,
        target: linkIsTargetBlank
      });
    }
  }

  handleCancel() {
    this.setState({
      file: null,
      linkValue: '',
      linkIsTargetBlank: false,
      textValue: this.props.linkText || '',
      error: null
    });
  }

  render() {
    const { linkInputAcceptsFiles, onCloseClick } = this.props;
    const {
      linkValue,
      textValue,
      linkIsTargetBlank,
      file,
      error
    } = this.state;

    return (
      <Modal onCloseClick={onCloseClick}>
        <div className="content-editor__input link">
          {
            file ? (
              <div key="preview" className="preview">
                <a className="upload-name" href={file.src}>{file.name}</a>
              </div>
            ) : (
              <div>
                <input
                  value={linkValue}
                  placeholder="Paste or type link (or email address if mailto)"
                  onChange={this.handleLinkChange}
                />
                {
                  linkInputAcceptsFiles && ([
                    <div key="separator" className="separator">or add downloadable file as link</div>,
                    <div key="add" className="add">
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
                  ])
                }
              </div>
            )
          }
          <div className="separator">and</div>
          <input
            value={textValue}
            placeholder="Add link text"
            onChange={this.handleLinkTextChange}
          />
          <div className="target">
            <span>Open link in a new tab:</span>
            <input
              name="target"
              type="checkbox"
              checked={linkIsTargetBlank}
              onChange={this.handleToggleTarget}
            />
          </div>
          <InputControls
            confirmText="Add Link"
            onConfirm={this.handleConfirm}
            onCancel={onCloseClick}
          />
        </div>
      </Modal>
    );
  }
}

LinkInput.propTypes = {
  blockType: PropTypes.string,
  linkText: PropTypes.string,
  linkInputAcceptsFiles: PropTypes.bool,
  onFileUpload: PropTypes.func,
  onAddLink: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default LinkInput;
