import React, { PropTypes } from 'react';

function Table(props) {
  const { title, tableData } = props.blockProps || props;
  const firstRowColKeys = Object.keys(tableData.r0);

  return (
    <figure className="content-editor__custom-block table">
      <table>
        <thead>
          {
            title ? (
              <tr className="table-header">
                <th colSpan={firstRowColKeys.length}>{title}</th>
              </tr>
            ) : null
          }
          <tr>
            {
              firstRowColKeys.map(colKey => (
                <th key={colKey}>{tableData.r0[colKey]}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(tableData).map(rowKey => {
              if (rowKey === 'r0') {
                return null;
              }

              const rowData = tableData[rowKey];
              return (
                <tr key={rowKey}>
                  {
                    Object.keys(rowData).map(cellKey => (
                      <td key={cellKey}>{rowData[cellKey]}</td>
                    ))
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </figure>
  );
}

Table.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      tableData: PropTypes.shape({})
    })
  })
};

export default Table;
