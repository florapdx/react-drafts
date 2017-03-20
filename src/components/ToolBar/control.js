import React, { PropTypes, Component } from 'react';

/*
 * Toolbar control button.
 * May be standalone or within menu.
 * May be of any type, custom or default, inline or block.
 */
class Control extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  /*
   * onMouseDown instead of onClick handler w/preventDefault
   * is fix for documented issue around focus-loss on editor
   * when clicking toolbar buttons, which leads to loss of styling
   * on text.
   */
  handleToggle(event) {
    event.preventDefault();
    this.props.onToggle(this.props.id);
  }

  render() {
    const { id, label, icon, isActive } = this.props;

    return (
      <li className={`control ${id}`}>
        <button
          className={`btn ${isActive && 'active'}`}
          type="button"
          onMouseDown={this.handleToggle}
        >
          <span
            className={icon ? `btn-inner fa fa-${icon}` : 'btn-inner'}
            title={label}
          >
            {icon ? null : label}
          </span>
        </button>
      </li>
    );
  }
}

Control.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  isActive: PropTypes.bool,
  onToggle: PropTypes.func
};

export default Control;
