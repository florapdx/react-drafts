import React, { PropTypes, Component } from 'react';

class SimpleDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = { menuOpen: false };
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
  }

  handleToggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  render() {
    const {
      menuFor,
      options,
      currentSelection,
      onSelectOption
    } = this.props;
    const { menuOpen } = this.state;

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
            <ul className="simple-menu__dropdown">
              {
                options.map(({ id, label }) => (
                  <li key={id} className="simple-menu__option">
                    <button onClick={() => onSelectOption(menuFor, id)}>{label}</button>
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    );
  }
}

SimpleDropdown.propTypes = {
  menuFor: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})),
  currentSelection: PropTypes.string,
  onSelectOption: PropTypes.func
};

export default SimpleDropdown;
