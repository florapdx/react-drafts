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
          c1: ''
        }
      }
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleUpdateTableData = this.handleUpdateTableData.bind(this);

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleAddColumn() {
    /*
     * This has to account for the first row -- adds unevenly
     */
    const { tableData, colCount } = this.state;
    const nextColCount = colCount + 1;

    Object.keys(tableData).forEach(rowKey => {
      tableData[rowKey][`c${nextColCount}`] = '';
    });

    this.setState({
      colCount: nextColCount,
      tableData
    });
  }

  handleAddRow(event) {
    /*
     * This adds a column to the row immediately above, but might
     * clear up when above fixed.
     */
    const { tableData, colCount, rowCount } = this.state;

    const nextRowCount = rowCount + 1;
    const nextRowObj = {};

    for (var i = 0; i <= colCount; ++i) {
      nextRowObj[`c${i}`] = '';
    }

    this.setState({
      rowCount: rowCount + 1,
      tableData: {
        ...tableData,
        [`r${nextRowCount}`]: nextRowObj
      }
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
                  isHeaderRow={idx === 0}
                  onChangeCell={this.handleUpdateTableData}
                  onAddColumn={this.handleAddColumn}
                />
              ))
            }
            <button
              className="add row fa fa-plus"
              type="button"
              onClick={this.handleAddRow}
            >
              Add row
            </button>
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
