import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

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
          data: [
              {
                  name: "Chennai",
                  y: 12.74,
              },
              {
                  name: "Kolkata",
                  y: 10.57,
              },
              {
                  name: "Delhi",
                  y: 7.23,
              },
              {
                  name: "Mumbai",
                  y: 5.58,
              },
              {
                  name: "Kanpur",
                  y: 4.02,
              },
              {
                  name: "Kochi",
                  y: 1.92,
              },
              
          ]
      }
  ],
}

class WeatherChart extends Component{
    constructor(props) {
        super(props);
        let responseData=(this.props.response !== undefined && this.props.response !== null)?JSON.parse(this.props.response):this.props.response;
        this.state = {
            seriesData:[],
            graphData:responseData

        }
    }
     
    render(){
        return(
            <div>
            {console.log("Chart"+this.state.graphData)}
                <ReactHighcharts config={WeatherChartConfig}/>
            </div>
        )
    }
}
export default WeatherChart;