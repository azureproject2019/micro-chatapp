import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';


class ChartPie extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seriesData:[],
            graphData:this.props.response

        }
    }
    render(){
        // let assignData={
        //     name:i.Object.keys(this.props.response[0])[0],
        //     y:100/this.props.response.length
            
        // }
        let responseData=this.props.response;
        
        let seriesChart=responseData.map(i=>Object.assign(i,{
            name:i[Object.keys(responseData[0])[0]],
            y:100/responseData.length
        }));
        this.state.seriesData.push(seriesChart);
        const ChartPieConfig={
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: ' '
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>'
                      // : {point.percentage:.1f} %
                  }
              }
          },
          credits:{
              enabled:false
          },
          // this.responseData.map(i=>i.y=100/this.responseData.length)
          series:[{
              name: 'Brands',
              colorByPoint: true,
              data:seriesChart
          }]
          }
        return(
            <div>
                {/* {console.log("assign"+assignData)} */}
                {console.log("Series"+this.state.seriesData)}
                <ReactHighcharts config={ChartPieConfig}/>
            </div>
        )
    }
}
export default ChartPie;