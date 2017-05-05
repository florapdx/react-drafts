import React, { Component } from 'react';

class TableRow extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, colKey) {
    const { value } = event.target;
    this.props.onChangeCell(value, 'r0', colKey);
  }

  render() {
    const { rowKey, rowData, isHeaderRow, onAddColumn } = this.props;

    return (
      <div className="row">
        {
          isHeaderRow && <div className="empty r0c0" />
        }
        {
          Object.keys(rowData).map(cellKey => {
            const colKey = isHeaderRow ? cellKey + 1 : cellKey;
            return (
              <input
                key={colKey}
                className="cell"
                value={rowData[colKey]}
                placeholder="col"
                onChange={() => this.handleChange(event, colKey)}
              />
            );
          })
        }
        {
          isHeaderRow && (
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