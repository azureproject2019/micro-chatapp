import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';


class WeatherChart extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seriesData:[],
            graphData:this.props.response
        }
    }
     
    render(){
        const WeatherChartConfig={
            chart: {
              type: 'column'
          },
          title: {
            text: ' '
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: ' '
              }
        
          },
          legend: {
              enabled: false
          },
          credits:{
            enabled:false
          },
          plotOptions: {
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: false,
                      // format: '{point.y:.1f}%'
                  }
              }
          },
        
          tooltip: {
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}°</b> C<br/>'
          },
        
          series: [
              {
                  name: " ",
                  colorByPoint: true,
                  data: this.state.graphData
              }
          ],
        }
        return(
            <div>
            {console.log("Chart"+this.state.graphData)}
                <ReactHighcharts config={WeatherChartConfig}/>
            </div>
        )
    }
}
export default WeatherChart;