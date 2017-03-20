import React, { PropTypes, Component } from 'react';
import Modal from '../../shared/modal';
import InputControls from './controls';

class LinkInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linkValue: '',
      textValue: this.props.linkText || ''
    };

    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleLinkTextChange = this.handleLinkTextChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleLinkChange(event) {
    this.setState({ linkValue: event.target.value });
  }

  handleLinkTextChange(event) {
    this.setState({ textValue: event.target.value });
  }

  handleConfirm() {
    const { linkValue, textValue } = this.state;
    this.props.onAddLink(this.props.blockType, {
      url: linkValue,
      text: textValue
    });
  }

  render() {
    const { onCloseClick } = this.props;
    const { linkValue, textValue } = this.state;

    return (
      <Modal onCloseClick={onCloseClick}>
        <div className="content-editor__input link">
          <input
            value={linkValue}
            placeholder="Paste or type link"
            onChange={this.handleLinkChange}
          />
          <div className="separator">and</div>
          <input
            value={textValue}
            placeholder="Linked text"
            onChange={this.handleLinkTextChange}
          />
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
  onAddLink: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default LinkInput;
