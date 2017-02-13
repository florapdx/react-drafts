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

    return (
      <div className="simple-menu">
        <div className="simple-menu selection">
          <button onClick={this.handleToggleMenu}>
            {currentSelection}
            <span className={menuOpen ? 'fa fa-angle-down' : 'fa fa-angle-up'}>
          </button>
        </div>
        {
          options.map(option => (
            <div className="simple-menu option">
              <button onClick={() => onSelectOption(menuFor, option)}>{option}</button>
            </div>
          ))
        }
      </div>
    );
  }
}

SimpleDropdown.propTypes = {
  menuFor: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  currentSelection: PropTypes.string,
  onSelectOption: PropTypes.func
};

export default SimpleDropdown;
