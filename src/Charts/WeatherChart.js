import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const WeatherChartConfig={
    // chart: {
    //     type: 'column',
    //   },
    //   title: {
    //     text: 'Weather Report '
    //   },
    //   xAxis: {
    //     type: 'category',
    //     title:{
    //       text:"20-nov"
    //     }
    //   },
    //   yAxis: {
    //     title: {
    //       text: ' '
    //     }
    
    //   },
    //   legend: {
    //     enabled: true,
    //     style:{
    //         fontSize:"10px"
    //     }
    //   },
    //   credits:{
    //       enabled:false
    //   },
    //   plotOptions: {
    //     series: {
    //       borderWidth: 0,
    //       dataLabels: {
    //         enabled: true,
    //         format: '{point.y:.1f}%'
    //       }
    //     }
    //   },
    
    //   tooltip: {
    //     headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    //     pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    //   },
    
    //   series: [
    //     {
    //       name: "Delhi",
    //       data: [
    //         {
    //           y: 7.23,
    //         },
    //       ]
    //     },
    //     {
    //       name: "Mumbai",
    //       data: [
    //         {
    //           y: 6.23,
    //         },
    //       ]
    //     },
    //     {
    //       name: "Chennai",
    //       data: [
    //         {
    //           y: 4.23,
    //         },
    //       ]
    //     }
    //   ]
    chart: {
      type: 'column'
  },
  title: {
    text: 'Weather Report '
  },
  // accessibility: {
  //     announceNewData: {
  //         enabled: true
  //     }
  // },
  xAxis: {
      type: 'category'
  },
  yAxis: {
      title: {
          text: 'Celsius'
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
          name: "Weather City",
          colorByPoint: true,
          data: [
              {
                  name: "Chennai",
                  y: 12.74,
                  drilldown: "Chennai"
              },
              {
                  name: "Kolkata",
                  y: 10.57,
                  drilldown: "Kolkata"
              },
              {
                  name: "Delhi",
                  y: 7.23,
                  drilldown: "Delhi"
              },
              {
                  name: "Mumbai",
                  y: 5.58,
                  drilldown: "Mumbai"
              },
              {
                  name: "Kanpur",
                  y: 4.02,
                  drilldown: "Kanpur"
              },
              {
                  name: "Kochi",
                  y: 1.92,
                  drilldown: "Kochi"
              },
              
          ]
      }
  ],
}

class WeatherChart extends Component{
    render(){
        return(
            <div>
                <ReactHighcharts config={WeatherChartConfig}/>
            </div>
        )
    }
}
export default WeatherChart;