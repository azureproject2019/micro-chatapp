import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// import '../../../../styles/Dashboard.scss';
import ChartPie from "./Charts/ChartPie";
import WeatherChart from "./Charts/WeatherChart";
import AreaGraph from "./Charts/AreaGraph";

class GraphComponent extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }

    render() {
        return (
                <div style={{width:"100%",height:"100vh"}}>
                {/* <Card style={{ margin: "auto" }}> */}
                <div style={{paddingTop:"10px"}}>
                    <Form.Label style={{padding:"5px 10px"}}>Type</Form.Label>
                    <select className="form-control" style={{width:"10%"}}>
                        <option>Column</option>
                        <option>Pie</option>
                        <option>Graph</option>
                    </select>
                </div>
                    <div style={{ padding: "0",overflow:"auto" }}>
                        <Row style={{marginLeft: "0px"}}>
                            <Col style={{ padding: "0.5%", paddingTop: "10px" }}>
                                <Card className="fieldset-chart">
                                    <legend className="boxShw" id="5dd212491cda8" style={{overflow:"hidden"}}>Hotel Relavent Search</legend>
                                    <div style={{width:"90%",margin:"auto"}}>
                                        <ChartPie/>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
            </div>
        )
    }
}

export default GraphComponent;