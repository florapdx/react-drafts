import React, { PropTypes, Component } from 'react';
import values from 'lodash.values';
import Modal from '../../../shared/modal';
import InputControls from '../controls';
import TableRow from './table-row';

class TableInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      rowCount: 0,
      colCount: 1,
      tableData: {
        r0: {
          c0: ''
        }
      }
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleUpdateTableData = this.handleUpdateTableData.bind(this);

    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleRemoveColumn = this.handleRemoveColumn.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  /*
   * Row and column keys are 0-indexed, while counts start at 1.
   */
  handleAddColumn() {
    const { tableData, colCount } = this.state;

    Object.keys(tableData).forEach(rowKey => {
      tableData[rowKey][`c${colCount}`] = '';
    });

    this.setState({
      colCount: colCount + 1,
      tableData
    });
  }

  handleRemoveColumn() {
    const { tableData, colCount } = this.state;

    // Always have at least one column
    const nextColCount = (colCount - 1) > 0 ? colCount - 1 : 1;
    const nextTableData = { ...tableData };

    Object.keys(nextTableData).forEach(rowKey => {
      delete nextTableData[rowKey][`c${nextColCount}`];
    });

    this.setState({
      colCount: nextColCount,
      tableData: nextTableData
    });
  }

  handleAddRow(event) {
    const { tableData, colCount, rowCount } = this.state;

    const nextRowObj = {};

    for (var i = 0; i < colCount; ++i) {
      nextRowObj[`c${i}`] = '';
    }

    this.setState({
      rowCount: rowCount + 1,
      tableData: {
        ...tableData,
        [`r${rowCount}`]: nextRowObj
      }
    });
  }

  handleRemoveRow(event) {
    const { tableData, rowCount } = this.state;

    // Always have at least one row
    const nextRowCount = (rowCount - 1 > 0) ? rowCount - 1 : 1;
    const nextTableData = { ...tableData };
    delete nextTableData[`r${nextRowCount}`];

    this.setState({
      rowCount: nextRowCount,
      tableData: nextTableData
    });
  }

  handleUpdateTableData(value, rowNum, colNum) {
    const { tableData } = this.state;

    const nextTableData = {
      ...tableData,
      [rowNum]: {
        ...tableData[rowNum],
        [colNum]: value
      }
    };

    this.setState({
      tableData: nextTableData
    });
  }

  handleConfirm() {
    const { blockType, onAddTable } = this.props;
    const { title, tableData } = this.state;

    onAddTable(blockType, {
      title,
      tableData
    });
  }

  render() {
    const {
      title,
      tableData,
      rowCount,
      colCount
    } = this.state;

    const tableDataList = values(tableData);

    return (
      <Modal onCloseClick={this.props.onCloseClick}>
        <div className="content-editor__input table">
          <input
            className="title"
            placeholder="Enter table title (optional)"
            value={title}
            onChange={this.handleTitleChange}
          />
          <div className="add-rows">
            {
              tableDataList.map((row, idx) => (
                <TableRow
                  key={`r${idx}`}
                  rowKey={`r${idx}`}
                  rowData={row}
                  onChangeCell={this.handleUpdateTableData}
                  onAddColumn={this.handleAddColumn}
                  onRemoveColumn={this.handleRemoveColumn}
                />
              ))
            }
            <div className="add remove row">
              <button
                className="fa fa-plus"
                type="button"
                onClick={this.handleAddRow}
              />
              <span>row</span>
              <button
                className="fa fa-minus"
                type="button"
                onClick={this.handleRemoveRow}
              />
            </div>
          </div>
          <InputControls
            key="controls"
            confirmText="Add Table"
            onConfirm={this.handleConfirm}
            onCancel={this.props.onCloseClick}
          />
        </div>
      </Modal>
    );
  }
}

TableInput.propTypes = {
  onAddTable: PropTypes.func,
  onCloseClick: PropTypes.func
};

export default TableInput;
