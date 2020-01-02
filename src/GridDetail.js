import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './ChatApp.css';

class GridDetail extends Component{
    constructor(props) {
        super(props);
        let responseData=this.props.response;
        this.state = {
          count:0,
          rowData:responseData
        }
      }
    createColumnDefs() {
        let responseData=this.props.response;
        
        var count=0;
        
        count=(responseData !== undefined && responseData !== null)?Object.keys(responseData[0]).length:0;
        // var count=(responseData !== undefined && responseData !== null)?Object.keys(responseData[0]).length:0;
        if(count===0){
          console.log("count=0"+count)
          return [
            {
              headerName: "Menu Name", field: "menu___Name", cellClass: 'cell-wrap',
              autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
            }
          ]
        }
        if(count===1){
          console.log("count=1"+count)
          let responseMenu=Object.keys(responseData[0]);
        return [
          { 
            headerName:responseMenu[0], field: responseMenu[0], cellClass: 'cell-wrap',
            autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
          }
        ]
      }
      if(count===2){
        console.log("count=1"+count)
        let responseMenu=Object.keys(responseData[0]);
      return [
        { 
          headerName:responseMenu[0], field: responseMenu[0], cellClass: 'cell-wrap',
          autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
        },
        { 
          headerName:responseMenu[1], field: responseMenu[1], cellClass: 'cell-wrap',
          autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
        }
      ]
    }
    if(count===3){
      console.log("count=1"+count)
      let responseMenu=Object.keys(responseData[0]);
    return [
      { 
        headerName:responseMenu[0], field: responseMenu[0], cellClass: 'cell-wrap',
        autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
      },
      { 
        headerName:responseMenu[1], field: responseMenu[1], cellClass: 'cell-wrap',
        autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
      },
      { 
        headerName:responseMenu[2], field: responseMenu[2], cellClass: 'cell-wrap',
        autoHeight: true, width: 400, cellStyle: { 'white-space': 'normal' } 
      }
    ]
  }
      }
    render(){
        return(
            <div style={{width:"100%",height:"100vh"}}>
                <div style={{paddingTop:"10px"}}>
                <div className="ag-theme-material" style={{height: '650px', width: '1200px'} }>
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
