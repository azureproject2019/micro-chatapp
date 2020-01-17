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
        let responseData=JSON.parse(JSON.stringify(this.props.response));
        let seriesChart=responseData.map(i=>Object.assign(i,{
            name:i[Object.keys(responseData[0])[0]],
            y:100/responseData.length
        }));
        console.log(this.state.graphData)
        this.state.seriesData.push(seriesChart);
        const pieData = seriesChart;
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
                  data: pieData
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