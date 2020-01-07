import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const AreaGraphConfig={
    chart: {
        type: 'spline'
      },
      title: {
        text: 'Fruit Searches'
      },
      xAxis: {
        categories: ['Orange', 'Apple', 'Pineapple', 'Lemon', 'Pumkin']
      },
      yAxis: {
        title: {
          text: ''
        },
        // labels: {
        //   formatter: function () {
        //     return this.value + '°';
        //   }
        // }
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      credits:{
        enabled:false
      },
      series: [{
        name: 'Tokyo',
        marker: {
          symbol: 'square'
        },
        data: [7.0, 7.0,7.0,7.0, {
          y: 7.0,
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          }
        }]
    
      }]
}

class AreaGraph extends Component{
    render(){
        return(
            <div>
                <ReactHighcharts config={AreaGraphConfig}/>
            </div>
        )
    }
}
export default AreaGraph;