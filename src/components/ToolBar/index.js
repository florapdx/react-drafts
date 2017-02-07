import React, { PropTypes, Component } from 'react';
import { TOOLBAR_DEFAULTS } from '../../constants/toolbar';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = { active: null }
  }

  render() {
    const { active } = this.state;
    const { customToolbarControls } = this.props;
    const toolbarControls = TOOLBAR_DEFAULTS.concat(customToolbarControls);

    return (
      <div className="csfd-editor-toolbar">
        <ul>
        {
          toolbarControls.map(control => (
            <li className={`csfd-editor__toolbar-control ${control.className}`}>
              <button className={`csfd-editor__toolbar-control-btn ${control.name === active && 'active'}`}>
                {control.element}
              </button>
            </li>
          ))
        }
        </ul>
      </div>
    );
  }
}

Toolbar.propTypes = {};

export default Toolbar;
