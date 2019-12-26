import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './ChatApp.css';

class GridDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
          count:1,
          rowData:JSON.parse(JSON.stringify(this.props.response))
        }
      }
      createColumnDefs() {
        if(this.state.count===1){
        return [
          { 
            headerName: "Menu Name", field: "menu___Name", cellClass: 'cell-wrap',
            autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
          }
        ]
      }
      }
    render(){
      // this.setState({count:Object.keys(this.props.response[0]).length});
        return(
            <div style={{width:"100%",height:"100vh"}}>
            {console.log(this.props.response)}
                <div style={{paddingTop:"10px"}}>
                <div className="ag-theme-material" style={ {height: '200px', width: '1200px'} }>
                  <AgGridReact
                      columnDefs={this.createColumnDefs()}
                      rowData={this.state.rowData}>
                  </AgGridReact>
                </div>
                </div>
            </div>
        );
    }
}

export default GridDetail;
