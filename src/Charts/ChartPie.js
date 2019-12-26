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
// this.graphData.map(i=>i.y=100/this.graphData.length)
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
    }, {
        name: 'Ultra Deluxe',
        y: 100/5
    }, {
        name: 'Villa',
        y: 100/5
    }] 
}]
}

class ChartPie extends Component{
    constructor(props) {
        super(props);
        let responseData=(this.props.response !== undefined && this.props.response !== null)?JSON.parse(this.props.response):this.props.response;
        this.state = {
            seriesData:[],
            graphData:[]

        }
    }
    
    render(){
        return(
            <div>
            {console.log("Chart"+this.responseData)}
                <ReactHighcharts config={ChartPieConfig}/>
            </div>
        )
    }
}
export default ChartPie;