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
const NUM_REGEX = /^\d+$/;

class PhotoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      srcValue: '',
      width: 0,
      height: 0,
      ratio: 1,
      link: '',
      linkIsTargetBlank: false,
      captionValue: '',
      error: null
    };

    const { currentEntity } = this.props;
    if (currentEntity) {
      const data = currentEntity.entity.getData();
      this.state = {
        ...this.state,
        srcValue: data.src,
        width: data.width,
        height: data.height,
        ratio: (parseInt(data.width, 10) / parseInt(data.height, 10)),
        link: data.href || '',
        linkIsTargetBlank: data.target,
        captionValue: data.caption
      };
    }


    this.handlePasteLink = this.handlePasteLink.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);

    this.setInitialDimensions = this.setInitialDimensions.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);

    this.handleHrefChange = this.handleHrefChange.bind(this);
    this.handleToggleTarget = this.handleToggleTarget.bind(this);

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.img = new Image();
  }

  componentWillUnmount() {
    this.img.removeEventListener('load', this.setInitialDimensions);
  }

  handlePasteLink(event) {
    const { value } = event.target;
    this.img.src = value;
    this.img.addEventListener('load', this.setInitialDimensions);

    this.setState({
      srcValue: value,
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
      this.img.src = acceptedFiles[0].preview;
      this.img.addEventListener('load', this.setInitialDimensions);

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

  setInitialDimensions(event) {
    const { naturalWidth, naturalHeight } = event.target;

    this.setState({
      width: naturalWidth || 440,
      height: naturalHeight || 0,
      ratio: naturalWidth && naturalHeight ?
        (naturalWidth /  naturalHeight) : this.state.ratio
    });
    this.img.removeEventListener('load', this.setInitialDimensions);
  }

  handleWidthChange(event) {
    const { value } = event.target;

    if (value && !NUM_REGEX.test(value)) {
      return;
    }

    this.setState({
      width: value,
      height: value && Math.round(value / this.state.ratio)
    });
  }

  handleHeightChange(event) {
    const { value } = event.target;

    if (value && !NUM_REGEX.test(value)) {
      return;
    }

    this.setState({
      width: value && Math.round(value * this.state.ratio),
      height: value
    });
  }

  handleHrefChange(event) {
    this.setState({
      link: event.target.value
    });
  }

  handleToggleTarget(event) {
    this.setState({
      linkIsTargetBlank: event.target.checked
    });
  }

  handleConfirm() {
    const {
      blockType,
      currentEntity,
      onFileUpload,
      onAddPhoto
    } = this.props;

    const {
      file,
      srcValue,
      width,
      height,
      link,
      linkIsTargetBlank,
      captionValue
    } = this.state;

    if (file) {
      // Get the stored file source
      onFileUpload(file)
        .then(resp => {
          onAddPhoto(
            blockType,
            currentEntity,
            {
              src: resp.src,
              caption: captionValue,
              width: width,
              height: height,
              href: link,
              target: linkIsTargetBlank
            }
          );
        })
        .catch(err => {
          this.setState({
            error: ERROR_MSG
          });
        });
    } else {
      onAddPhoto(
        blockType,
        currentEntity,
        {
          src: srcValue,
          caption: captionValue,
          width: width,
          height: height,
          href: link,
          target: linkIsTargetBlank
        }
      );
    }
  }

  handleCancel() {
    this.setState({
      file: null,
      srcValue: '',
      captionValue: '',
      width: 0,
      height: 0,
      link: '',
      linkIsTargetBlank: false,
      error: ''
    });
    this.img.removeEventListener('load', this.setInitialDimensions);
  }

  render() {
    const {
      currentEntity,
      allowPhotoLink,
      allowPhotoSizeAdjust,
      maxImgWidth
    } = this.props;
    const {
      file,
      srcValue,
      width,
      height,
      link,
      linkIsTargetBlank,
      captionValue,
      error
    } = this.state;

    const imgSizeWarning = (width && maxImgWidth) && width > maxImgWidth;

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
        {
          allowPhotoSizeAdjust && (
            <div className="image-sizing">
              <div>
                <span>Set custom image size:</span>
                {
                  imgSizeWarning && (
                    <p className="warning-msg">
                      {`* Max width is ${maxImgWidth}px.`}
                    </p>
                  )
                }
              </div>
              <input
                className={`width ${imgSizeWarning && 'size-warning'}`}
                placeholder="width"
                value={width}
                onChange={this.handleWidthChange}
              />
              <span>x</span>
              <input
                className={`width ${imgSizeWarning && 'size-warning'}`}
                placeholder="height"
                value={height}
                onChange={this.handleHeightChange}
              />
            </div>
          )
        }
        {
          allowPhotoLink && (
            <div key="image-link" className="image-link">
              <span>Is the image a link?</span>
              <input
                placeholder="Paste link here"
                value={link}
                onChange={this.handleHrefChange}
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
            </div>
          )
        }
      </div>,
      <InputControls
        key="controls"
        confirmText={currentEntity ? 'Update' : 'Add Photo'}
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
  currentEntity: PropTypes.shape({}),
  allowPhotoLink: PropTypes.bool,
  allowPhotoSizeAdjust: PropTypes.bool,
  maxImgWidth: PropTypes.number,
  onFileUpload: PropTypes.func,
  onAddPhoto: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default PhotoInput;
