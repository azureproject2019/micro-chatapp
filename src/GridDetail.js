import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './ChatApp.css';

class GridDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          columnDefs: [
            { headerName: "Make", field: "make", cellClass: 'cell-wrap',
            autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } },
            { headerName: "Model", field: "model", cellClass: 'cell-wrap',
            autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } },
            { headerName: "Price", field: "price", cellClass: 'cell-wrap',
            autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } }],
          rowData: [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxter", price: 72000 }]
        }
      }
    render(){
        return(
            <div style={{width:"100%",height:"100vh"}}>
                <div style={{paddingTop:"10px"}}>
                <div className="ag-theme-material" style={ {height: '200px', width: '1200px'} }>
                  <AgGridReact
                      columnDefs={this.state.columnDefs}
                      rowData={this.state.rowData}>
                  </AgGridReact>
                </div>
                </div>
            </div>
        );
    }
}

export default GridDetail;
