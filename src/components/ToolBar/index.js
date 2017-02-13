import React, { PropTypes, Component } from 'react';
import { TOOLBAR_DEFAULTS } from '../../constants/toolbar';
import SimpleDropdown from '../shared/simple-dropdown';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.controls = { ...TOOLBAR_DEFAULTS, ...props.toolbarControls };

    const menus = this.controls.findWhere(control => control.type === 'menu');
    const menuMap = {};
    menus.forEach(menu => menuMap[id] = );

    this.state = {
      activeButton:
      activeMenuItems:
    }

    this.handleSelectHeading = this.handleSelectHeading.bind(this);
  }

  render() {
    const { active } = this.state;
    const { controls } = this;

    return (
      <div className="csfd-editor-toolbar">
        {
          Object.values(controls).map(control =>)
          controls.headings && (
            <SimpleDropdown
              menuFor={controls.headings.id}
              options={controls.headings.options}
              currentSelection={}
            />
          )
        }
        {
          this.controls.map(control => (
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
