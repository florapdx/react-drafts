import React, { PropTypes, Component } from 'react';
import values from 'lodash.values';
import {
  CONTEXT_MENU,
  TOOLBAR_DEFAULTS
} from '../../constants/toolbar';
import SimpleDropdown from '../shared/simple-dropdown';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.controls = { ...TOOLBAR_DEFAULTS, ...props.toolbarControls };

    this.state = {
      activeBlockControl: '',
      activeInlineControls: []
    };

    this.handleMenuSelection = this.handleMenuSelection.bind(this);
    this.handleButtonSelection = this.handleButtonSelection.bind(this);
  }

  handleMenuSelection(menuFor, id) {
    this.setState({
      activeBlockControl: id
    });
  }

  handleButtonSelection() {

  }

  render() {
    const { activeBlockControl, activeInlineControls } = this.state;
    const { controls } = this;

    return (
      <div className="csfd-editor-toolbar">
        <ul className="csfd-editor-toolbar__controls">
          {
            values(controls).map(({ id, context, type, options, icon, label }) =>
              (context && context === CONTEXT_MENU) ? (
                <SimpleDropdown
                  key={id}
                  menuFor={id}
                  options={options}
                  currentSelection={options.indexOf(activeBlockControl) >= 0 ? activeBlockControl : label}
                  onSelectOption={this.handleMenuSelection}
                />
              ) : (
                <li key={id} className={`csfd-editor__toolbar-control ${id}`}>
                  <button
                    className={`csfd-editor__toolbar-control-btn ${(activeBlockControl === id || activeInlineControls.indexOf(id) >= 0) && 'active'}`}
                    onClick={() => this.handleButtonSelection(id)}
                  >
                    <span className={icon ? `btn-inner fa fa-${icon}` : 'btn-inner'} title={label}>
                      {icon ? null : label}
                    </span>
                  </button>
                </li>
              )
            )
          }
        </ul>
      </div>
    );
  }
}

Toolbar.propTypes = {
  toolbarControls: PropTypes.shape({})
};

export default Toolbar;
