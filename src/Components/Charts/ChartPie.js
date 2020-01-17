import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {
    HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend, ColumnSeries, SplineSeries, PieSeries
  } from 'react-jsx-highcharts';
  require("highcharts/highcharts-more")(Highcharts);
  require("highcharts/modules/exporting")(Highcharts);
class ChartPie extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seriesData:[],
            graphData:[]

        }
    }
    render(){
        // let assignData={
        //     name:i.Object.keys(this.props.response[0])[0],
        //     y:100/this.props.response.length
            
        // }
        let responseData=JSON.parse(JSON.stringify(this.props.response));
        let seriesChart=responseData.map(i=>Object.assign(i,{
            name:i[Object.keys(responseData[0])[0]],
            y:100/responseData.length
        }));
        console.log(this.state.graphData)
        this.state.seriesData.push(seriesChart);
        const pieData = seriesChart;
        return(
            <div>
                {/* {console.log("assign"+assignData)} */}
                {console.log("Series"+this.state.seriesData)}
                <HighchartsChart>
                   <Chart />

                   {/* <Title>Combination chart</Title> */}

                   <Legend />

                   <XAxis categories={['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']} />

                   <YAxis>

                       <PieSeries 
                           name=" " 
                           data={pieData} 
                           showInLegend={true}
                       />
                   </YAxis>
                </HighchartsChart>
            </div>
        )
    }
}
// export default ChartPie;
export default withHighcharts(ChartPie, Highcharts);