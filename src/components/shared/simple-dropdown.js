import React, { PropTypes, Component } from 'react';

/*
 * Simple dropdown menu.
 * Takes an array of children to display in dropdown.
 * `menuFor` prop serves as an identifier for cases where
 * a parent renders multiple menus.
 */
class SimpleDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false };

    this.getActiveOption = this.getActiveOption.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  getActiveOption() {
    return this.props.children.find(child => child.props.isActive);
  }

  /*
   * Close menu on menu header or dropdown button click.
   * Responds to bubbled event in the later case.
   */
  handleToggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  handleReset() {
    const activeOption = this.getActiveOption();
    activeOption.props.onToggle(activeOption.props.id);
  }

  render() {
    const { menuFor, children } = this.props;
    const { menuOpen } = this.state;
    const activeOption = this.getActiveOption();

    return (
      <div className={`simple-menu ${menuFor}`}>
        <div className="simple-menu__selection">
          <button className="simple-menu__label" onClick={this.handleToggleMenu}>
            {activeOption ? activeOption.props.label : menuFor}
            <span className={menuOpen ? 'fa fa-angle-up' : 'fa fa-angle-down'} />
          </button>
        </div>
        {
          menuOpen && ([
            <ul
              key="menu"
              className="simple-menu__dropdown"
              onClick={this.handleToggleMenu}
            >
              {
                activeOption ? [
                    <button
                      key="default"
                      className="simple-menu__deselect"
                      onClick={this.handleReset}
                    >--</button>
                  ].concat(children) : children
              }
            </ul>,
            <div
              key="screen"
              className="simple-menu__click-off"
              onClick={this.handleToggleMenu}
            ></div>
          ])
        }
      </div>
    );
  }
}

SimpleDropdown.defaultProps = {
  children: []
};

SimpleDropdown.propTypes = {
  menuFor: PropTypes.string.isRequired
};

export default SimpleDropdown;
