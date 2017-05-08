import React, { Component } from 'react';

class TableRow extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, colKey) {
    const { rowKey, onChangeCell } = this.props;
    onChangeCell(event.target.value, rowKey, colKey);
  }

  render() {
    const { rowKey, rowData, onAddColumn } = this.props;

    return (
      <div className="row">
        {
          Object.keys(rowData).map(cellKey => {
            // cellKey is the key of the column, ie `c1` or `c9`
            return (
              <input
                key={cellKey}
                className="cell"
                value={rowData[cellKey]}
                placeholder=""
                onChange={event => this.handleChange(event, cellKey)}
              />
            );
          })
        }
        {
          rowKey === 'r0' && (
            <button
              className="add column fa fa-plus"
              type="button"
              onClick={onAddColumn}
            >
              Add column
            </button>
          )
        }
      </div>
    );
  }
}

export default TableRow;