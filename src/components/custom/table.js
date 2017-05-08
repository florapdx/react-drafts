import React, { PropTypes } from 'react';

function Table(props) {
  const { title, tableData } = props.blockProps || props;

  return (
    <figure className="content-editor__custom-block table">
      {
        title && <div className="table-header">{title}</div>
      }
      <table>
        <thead>
          <tr>
            <th className="control-cell" />
            {
              Object.keys(tableData.r0).map(colKey => (
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
