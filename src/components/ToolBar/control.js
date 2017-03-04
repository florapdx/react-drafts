import React, { PropTypes, Component } from 'react';

/*
 * Toolbar control button.
 * May be standalone or within menu.
 * May be of any type, custom or default, inline or block.
 */
class Control extends Component {
  constructor(props) {
    super(props);

    const { id, icon } = this.props;
    this.classes = {
      li: `csfd-editor__toolbar-control ${id}`,
      button: 'csfd-editor__toolbar-btn',
      span: icon ? `btn-inner fa fa-${icon}` : 'btn-inner'
    };

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
    const { classes } = this;

    return (
      <li className={classes.li}>
        <button
          className={`${classes.button} ${isActive && 'active'}`}
          onMouseDown={this.handleToggle}
        >
          <span className={classes.span} title={label}>
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
