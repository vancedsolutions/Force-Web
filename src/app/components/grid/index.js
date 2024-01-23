import React, { Component } from 'react';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


class Grid extends Component {
  constructor(props) {
    super(props);
    this.height = this.props.height || '100%';
  }
  state = {
    overlayLoadingTemplate:
      '<span className="ag-overlay-loading-center">Loading...</span>',
    overlayNoRowsTemplate:
      '<span style="padding: 10px;">No Record Found</span>',
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
    }

  }
  componentDidUpdate(prevProps, prevState, snapshot) {
  }
  render() {
    return (
      <div className="ag-theme-alpine" style={{ height: this.height, width: '100%' }}>
        <AgGridReact
          defaultColDef={{ ...this.state.defaultColDef, ...(this.props.defaultColDef || {}) }}
          frameworkComponents={this.props.frameworkComponent}
          columnDefs={this.props.columnDefs}
          rowData={this.props.rowData}
          rowModelType={this.props.rowModelType}
          paginationPageSize={this.props.paginationPageSize}
          enableFilter={true}
          filter={this.props.filter}
          cacheOverflowSize={this.props.cacheOverflowSize}
          infiniteInitialRowCount={this.props.infiniteInitialRowCount}
          maxBlocksInCache={this.props.maxBlocksInCache}
          overlayLoadingTemplate={this.state.overlayLoadingTemplate}
          overlayNoRowsTemplate={this.state.overlayNoRowsTemplate}
          onGridReady={this.props.onGridReady}
          enableRangeSelection={true}
          enableRangeHandle={true}
          autoGroupColumnDef={this.props.autoGroupColumnDef}
          groupMultiAutoColumn={this.props.groupMultiAutoColumn}
          groupDefaultExpanded={this.props.groupDefaultExpanded}
          debounceVerticalScrollbar={true}

        >
        </AgGridReact>
      </div>

    );
  }
}
export default Grid;
