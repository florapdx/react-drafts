import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    const { rowKey, rowData, onAddColumn, onRemoveColumn } = this.props;

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
            <div className="add remove column">
              <button
                className="fa fa-plus"
                type="button"
                onClick={onAddColumn}
              />
              <span>col</span>
              <button
                className="fa fa-minus"
                type="button"
                onClick={onRemoveColumn}
              />
            </div>
          )
        }
      </div>
    );
  }
}

TableRow.propTypes = {
  rowKey: PropTypes.string,
  rowData: PropTypes.shape({}),
  onChangeCell: PropTypes.func,
  onAddColumn: PropTypes.func,
  onRemoveColumn: PropTypes.func
};

export default TableRow;
