import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const ChartPieConfig={
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
},
title: {
    text: 'Hotel Report'
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
series: [{
    name: 'Brands',
    colorByPoint: true,
    data: [{
        name: 'Non AC',
        y: 100/5,
    }, {
        name: 'AC',
        y: 100/5
    }, {
        name: 'Deluxe',
        y: 100/5
    },
    {
        name: 'Ultra Deluxe',
        y: 100/5
    },{
        name: 'Villa',
        y: 100/5
    }]
}]
}

class ChartPie extends Component{
    render(){
        return(
            <div>
                <ReactHighcharts config={ChartPieConfig}/>
            </div>
        )
    }
}
export default ChartPie;