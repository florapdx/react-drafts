import React, { PropTypes, Component } from 'react';
import Modal from '../../shared/modal';
import InputControls from './controls';

class RichMediaInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      src: '',
      width: null,
      height: null,
      captionValue: '',
      error: null
    };

    const { currentEntity } = this.props;
    if (currentEntity) {
      const data = currentEntity.entity.getData();
      this.state = {
        ...this.state,
        src: data.src,
        width: data.width,
        height: data.height,
        captionValue: data.caption
      };
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    const parser = new DOMParser();
    const html = parser.parseFromString(event.target.value, 'text/html');
    const iframe = html.getElementsByTagName('iframe')[0];

    if (!iframe || !iframe.getAttribute('src')) {
      this.setState({ error: "Please make sure that you're posting the full embed code." });
      return;
    }

    this.setState({
      src: iframe.getAttribute('src'),
      width: iframe.getAttribute('width'),
      height: iframe.getAttribute('height'),
      error: null
    });
  }

  handleCaptionChange(event) {
    this.setState({
      captionValue: event.target.value
    });
  }

  handleConfirm() {
    const { blockType, currentEntity, onAddRichMedia } = this.props;
    const {
      src,
      width,
      height,
      captionValue
    } = this.state;

    onAddRichMedia(
      blockType,
      currentEntity,
      {
        src,
        width,
        height,
        caption: captionValue
      }
    );
  }

  handleCancel() {
    this.setState({
      src: '',
      width: null,
      height: null,
      captionValue: '',
      error: null
    });
  }

  render() {
    const { currentEntity } = this.props;
    const {
      src,
      width,
      height,
      captionValue,
      error
    } = this.state;

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="content-editor__input rich">
          {
            src ? ([
              <div key="preview" className="preview">
                <div className="rich-media-wrapper">
                  <iframe
                    src={src}
                    width={width}
                    height={height}
                    frameBorder="0"
                    allowFullScreen={false}
                  />
                </div>
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
                confirmText={currentEntity ? 'Update' : 'Add Media'}
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
              />
            ]) : (
              <div>
                <input
                  value={src}
                  placeholder="Paste embed code (YouTube, SoundCloud, etc)"
                  onChange={this.handleChange}
                />
                { error && <p className="input-error">{error}</p> }
              </div>
            )
          }
        </div>
      </Modal>
    );
  }
}

RichMediaInput.propTypes = {
  blockType: PropTypes.string,
  currentEntity: PropTypes.shape({}),
  onAddRichMedia: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default RichMediaInput;
