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
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
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

  render() {
    const { menuFor, children } = this.props;
    const { menuOpen } = this.state;

    let currentSelection = menuFor;
    children.forEach(child => {
      if (child.props.isActive) {
        currentSelection = child.props.label;
      }
    });

    return (
      <div className="simple-menu">
        <div className="simple-menu__selection">
          <button className="simple-menu__label" onClick={this.handleToggleMenu}>
            {currentSelection}
            <span className={menuOpen ? 'fa fa-angle-up' : 'fa fa-angle-down'} />
          </button>
        </div>
        {
          menuOpen && (
            <ul className="simple-menu__dropdown" onClick={this.handleToggleMenu}>
              {children}
            </ul>
          )
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
