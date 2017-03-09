import React, { PropTypes, Component } from 'react';
import Modal from '../../shared/modal';
import InputControls from './controls';

class VideoInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      src: '',
      captionValue: '',
      error: null
    };

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
      error: null
    });
  }

  handleCaptionChange(event) {
    this.setState({ captionValue: event.target.value });
  }

  handleConfirm() {
    const { src, captionValue } = this.state;
    this.props.onAddVideo(this.props.blockType, {
      src,
      caption: captionValue
    });
  }

  handleCancel() {
    this.setState({
      src: '',
      captionValue: '',
      error: null
    });
  }

  render() {
    const { src, captionValue, error } = this.state;

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="csfd-content-editor__input video">
          {
            src ? ([
              <div key="preview" className="csfd-content-editor__input-preview">
                <iframe src={src} frameBorder="0" allowFullScreen={false} />
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
                confirmText="Add Video"
                onConfirm={this.handleConfirm}
                onCancel={this.onCancel}
              />
            ]) : (
              <div>
                <input
                  value={src}
                  placeholder="Paste video embed code (YouTube, etc)"
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

VideoInput.propTypes = {
  blockType: PropTypes.string,
  onAddVideo: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default VideoInput;
