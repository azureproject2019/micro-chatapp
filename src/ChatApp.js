import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Route,
    Link,
    Switch,
    Redirect
  } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import Sidebar from './Sidebar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
import './Styles/Sidebar.css';
// import './Styles/ChatApp.css';
// import closeIcon from './error.svg';
// import mailIdIcon from './sendmail.svg';
// import jiraTicketIcon from './ticket.svg';
// import FacebookIcon from './facebook.svg';
// import googleIcon from './search.svg';
// import twitterIcon from './twitter.svg';
// import emailIcon from './email.svg';
// import convIcon from './chat.svg';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';

import ScrollToBottom from 'react-scroll-to-bottom';
//import 'bootstrap/dist/css/bootstrap.css';
import GridDetail from './Components/GridDetail';
import GraphComponent from './Components/Graph';
import './Styles/ChatApp.css';


export class ChatApp extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    onHelloEvt: PropTypes.func
  }

  static defaultProps = {
    name: "Test"
  }
//   constructor(props) {
//     super(props);
//     this.state = {
//         graphData:[]
//     }
// }
    constructor(props) {
        super(props);
        this.state = {
            userMessage: '',
            conversation: [],
            userId : new Date().getTime(),
            toEmailModalOpen : false,
            isJiraModalOpened : false,
            isChatModalOpened : false,
            toEmailAddress : '',
            isAuthenticated : false,
            toPassResponce:[],
            checkResponse:[],
            jira : [{
                itemType:"",
                itemValue:""
            },{
                itemType:"Task",
                itemValue:"Task"
            },{
                itemType:"Story",
                itemValue:"Story"
            },{
                itemType:"Bug",
                itemValue:"Bug"
            }],
            selectedItemType:"",
            summary:"",
            description:""
        };
    }

    componentDidMount() {
        this.startListenerWebSocketClient();
        this.startPublisherWebSocketClient();
    }

    startListenerWebSocketClient() {
        this.listenSocket = new WebSocket("wss://micro-chatapp-nodered-flow.herokuapp.com/public/messagepublish"); //server publishes
        this.listenSocket.onopen = () => {
            // on connecting, do nothing but log it to the console
        }

        function isHTML(str) {
            var doc = new DOMParser().parseFromString(str, "text/html");
            return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
        }
        
        function convertToMessage(str) {
            let convertedMessage='';
            if(typeof str == 'string') {
                convertedMessage=str;
            } else {
                try {
                    let tempstr=JSON.stringify(str);
                    JSON.parse(tempstr);
                    convertedMessage=tempstr;
                } catch (e) {
                    convertedMessage=str;
                }
            }
            return convertedMessage;
        }
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        this.listenSocket.onmessage = event => {
            let response=JSON.parse(event.data.trim());
            console.log(response.data);
            // this.checkResponse=response.data;
            if(isJson(response.data)){
                this.toPassResponce=(response.data !== undefined && response.data !== null)?JSON.parse(response.data):response.data;
            }
            else{
                this.toPassResponce=response.data;
            }
	    if(response.data !== undefined && response.data !== null && response.data.indexOf('Error: connect ECONNREFUSED') !== -1) {
		  const msg = {
                    text: convertToMessage('Some thing went wrong, please try again after some time.'),
                    user: 'ai'
                };
		this.setState({
                    conversation: [...this.state.conversation, msg],
                });
	    } else if(response.userId === this.state.userId) {
                let message=response.data;
                if(isHTML(message) && message.indexOf('Error: connect ECONNREFUSED') !== -1) {
                    message='Some thing went wrong, please try again after some time.'
                }
                const msg = {
                    text: convertToMessage(message),
                    user: 'ai'
                };
                this.setState({
                    conversation: [...this.state.conversation, msg],
                });
            }
        }

        this.listenSocket.onclose = () => {
            this.startListenerWebSocketClient();
        }

    }
    startPublisherWebSocketClient() {
        this.publishSocket = new WebSocket("wss://micro-chatapp-nodered-flow.herokuapp.com/public/messagereceive");

        this.publishSocket.onopen = () => {
            // on connecting, do nothing but log it to the console
        }



        this.publishSocket.onmessage = evt => {
            const message = JSON.parse(evt.data);
            this.addMessage(message);
        }

        this.publishSocket.onclose = () => {
            this.startPublisherWebSocketClient();
        }

    }
    submitMessage = messageString => {
	//messageString=encodeURI(messageString);
        const message = { channelType: 'chatbot', message: messageString, userId: this.state.userId }
        this.publishSocket.send(JSON.stringify(message))
    }
    handleChange = event => {
        this.setState({ userMessage: event.target.value });
    };


    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.userMessage.trim()) return;

        const msg = {
            text: this.state.userMessage,
            user: 'human',
        };

        this.setState({
            conversation: [...this.state.conversation, msg],
        });

        this.submitMessage({
            message: this.state.userMessage,
        });

        this.setState({ userMessage: '' });
    };

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    getContent(event, className, i) {
        if(event.user === 'human') {
            return (<div key={`${className}-${i+1}`} className={`${className} chat-bubble`}>
                <span className="chat-content">{event.text}</span>
            </div>);
        } else {
            if(this.isJson(event.text)) {
                const items=JSON.parse(event.text);
                return (
                    <div className="card-container">
                        {items.map((item) =>
                            <span className="card">
                                {Object.keys(item).map(function (key) {
                                        return (
                                            (<div><h6 className="room-detail">{key}</h6><span className="room-response">{item[key]}</span></div>)
                                        )
                                    }
                                )}
                            </span>
                        )
                        }
                    </div>
                );
            } else {
                return (<div key={`${className}-${i}`} className={`${className} chat-bubble`}>
                    <span className="chat-content">{event.text}</span>
                </div>);
            }
        }
    }

    sendEmail(conversation, publisher, toEmail) {
        const message = { channelType: 'email', message: conversation, subject: 'Chat History', to:toEmail };
        this.setState({toEmailModalOpen: false});
        publisher.send(JSON.stringify(message));
    }

    createJira(itemType,itemSummary,itemDescription,publisher) {
        let message = { channelType: 'jira', itemType: itemType, itemSummary: itemSummary, itemDescription };
        this.setState({isJiraModalOpened: false});
        publisher.send(JSON.stringify(message));
    }

  render() {
      const handleEmailModalClick = (toEmailModalOpen) => {
          this.setState({toEmailModalOpen: toEmailModalOpen, toEmailAddress : ''});
      }
      const handleJiraModalClick = (isJiraModalOpened) => {
          this.setState({isJiraModalOpened: isJiraModalOpened});
      }
      const handleChatModalClick = (isChatModalOpened) => {
              this.setState({isChatModalOpened: !isChatModalOpened});
      }


      const handleToEmailAddressChange = event => {
          this.setState({ toEmailAddress: event.target.value });
      };

      const handleJiraDescriptionChange = event => {
          this.setState({description: event.target.value});
      }

      const handleJiraSummaryChange = event => {
          this.setState({summary: event.target.value});
      }
      const responseFacebook = (response) => {
          if(response.userID !== undefined) {
              this.setState({isAuthenticated: true});
          }
      }
      const responseGoogle = (response) => {
          if(response.googleId !== undefined) {
              this.setState({isAuthenticated: true});
          }
      }
      const ChatBubble = (event, i, className) => {
          return (
              <div>{this.getContent(event, className, i)}</div>
          );
      };



      const chat = this.state.conversation.map((e, index) =>
          ChatBubble(e, index, e.user)
      );



      return (
        <BrowserRouter>
          <div id="chat">
              {/* <div className="col-md-12">
              <h1>{this.props.name}</h1>
              <p onClick={this.editSlogan}>Hello</p>
          </div> */}
          <SideNav onSelect={(selected) => {   }}  className="sidebar-custom" >
                {/* <SideNav.Toggle /> */}
                <SideNav.Nav>
                    <NavItem className="sidebarNavItems" eventKey="charts">
                        <NavIcon title="Grid">
                            <Link to="/" style={{paddingRight:"0"}}><img src="https://nocc.azurepower.com/images/menu/Loading.png"  alt="icon" className="topnavImgLeft" style={{ width: '3em' }} /></Link>
                        </NavIcon>
                    </NavItem>
                    <NavItem className="sidebarNavItems"  eventKey="dashboard">
                        <NavIcon title="Graph">
                            <Link to="/Graph" style={{paddingRight:"0"}}><img src="https://nocc.azurepower.com/images/menu/Line-Chart.png" alt="Analytics" style={{width:" 3em"}}/></Link>
                        </NavIcon>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            {/* {this.toPassResponce.length>1? */}
            {typeof(this.toPassResponce)==='object'?<div  style={{paddingLeft:"75px",background:"#f5f6fa"}}>
                <Switch>
                <Route exact path="/Graph" component={()=> <GraphComponent response={this.toPassResponce}/>} />
                <Route path="/" component={()=> <GridDetail  response={this.toPassResponce}/>} />
                </Switch>
                {/* <GraphComponent/> */}
            </div>
            :
            <div style={{ paddingLeft: "80px",background:"#f5f6fa",overflow:"auto" }}>
                <Row style={{marginLeft: "0px"}}>
                    <Col style={{ padding: "0.5%", paddingTop: "10px",maxWidth: "calc(100% - 360px)" }}>
                        <Card className="fieldset-chart">
                            <div style={{width:"90%",margin:"auto"}}>
                                <div>No data to Show</div> 
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        }
            
            <div style={{maxHeight:"calc(100% - 40px)"}}>
              <div className="animate-chat chat-button-theme-bubble"   title="Click to Talk">
                  <div className="button-greeting">
                      <div className="button-greeting-close">
                          <svg

                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                              </path>
                              <path
                                  d="M0 0h24v24H0z"
                                  fill="none">
                              </path>
                          </svg>
                      </div>
                  </div>
                  <div className="chat-button pulse"  onClick={() => handleChatModalClick(this.state.isChatModalOpened)}  >
                      {/* <img className="chat-icon" src={convIcon}/> */}
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        	 viewBox="0 0 477.6 477.6" className="chat-svg" width="60%" height="60%">
                        <g>
                        	<g>
                        		<path className="mail-path" d="M407.583,70c-45.1-45.1-105-70-168.8-70s-123.7,24.9-168.8,70c-87,87-93.3,226-15.8,320.2c-10.7,21.9-23.3,36.5-37.6,43.5
                        			c-8.7,4.3-13.6,13.7-12.2,23.3c1.5,9.7,8.9,17.2,18.6,18.7c5.3,0.8,11,1.3,16.9,1.3l0,0c29.3,0,60.1-10.1,85.8-27.8
                        			c34.6,18.6,73.5,28.4,113.1,28.4c63.8,0,123.7-24.8,168.8-69.9s69.9-105.1,69.9-168.8S452.683,115.1,407.583,70z M388.483,388.5
                        			c-40,40-93.2,62-149.7,62c-37.8,0-74.9-10.1-107.2-29.1c-2.1-1.2-4.5-1.9-6.8-1.9c-2.9,0-5.9,1-8.3,2.8
                        			c-30.6,23.7-61.4,27.2-74.9,27.5c16.1-12,29.6-30.6,40.9-56.5c2.1-4.8,1.2-10.4-2.3-14.4c-74-83.6-70.1-211,8.9-290
                        			c40-40,93.2-62,149.7-62s109.7,22,149.7,62C471.083,171.6,471.083,306,388.483,388.5z"/>
                        		<path className="mail-path" d="M338.783,160h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,160,338.783,160z"/>
                        		<path className="mail-path" d="M338.783,225.3h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,225.3,338.783,225.3z"
                        			/>
                        		<path className="mail-path" d="M338.783,290.6h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,290.6,338.783,290.6z"
                        			/>
                                    </g>
                                    </g>
                        </svg>
                  </div>
              </div>
                  <div>
                      { this.state.isChatModalOpened? (
                          <div id="chatbot-open" className=" slide-top chat-window chat-modal-window">
                              <div className="chat-heading">
                                  <h1 className="animate-chat pacifino">Log N Solve</h1>
                                  <div className="interior">
                                      <div>
                                          {/* <button type="button" className="btn btn-primary"  data-toggle="modal" data-target="#exampleModalCenter">Login</button> */}
                                          {/* <img className="mail-box" onClick={() => this.sendEmail(this.state.conversation, this.publishSocket)} src={mailIcon} title="Send Conversation"/> */}
                                          <a  href="#open-modal">
                                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            	 viewBox="0 0 512 512" className="mail-svg mailId-box"  title="Enter Your Mail"  onClick={() => handleEmailModalClick(true)} >
                                            <g>
                                            	<g>
                                            		<polygon className="mail-path" points="119.988,365.064 119.988,492 396.949,122.719"/>
                                            	</g>
                                            </g>
                                            <g>
                                            	<g>
                                            		<path className="mail-path" d="M8.279,243.581c-10.502,5.251-11.149,20.025-1.157,26.191l103.449,63.668l376.6-331.862L488.356,0L8.279,243.581z"/>
                                            	</g>
                                            </g>
                                            <g>
                                            	<g>
                                            		<path className="mail-path" d="M509.239,22.136L224.05,403.264l173.071,106.509c8.793,5.44,20.641,0.461,22.603-10.005L512,19.719L509.239,22.136z"/>
                                            	</g>
                                                </g>
                                            </svg>
                                          
                                          {/* <img className="mailId-box" src={mailIdIcon}/> */}
                                          </a>
                                          <a  href="#open-jira-modal">
                                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            	 viewBox="0 0 481.1 481.1" className="ticket-svg mailId-box"  onClick={() => handleJiraModalClick(true)}  title="Jira">
                                            <g>
                                            	<g>
                                            		<path className="ticket-path" d="M470.5,159.6l-36-35.7c-10.7,10.7-23.6,16-38.8,16c-15.2,0-28.2-5.3-38.8-16c-10.7-10.7-16-23.6-16-38.8
                                            			c0-15.2,5.3-28.2,16-38.8l-35.7-35.7c-7-7-15.7-10.6-25.8-10.6c-10.2,0-18.8,3.5-25.8,10.6l-259,258.7c-7,7-10.6,15.7-10.6,25.8
                                            			c0,10.2,3.5,18.8,10.6,25.8l35.7,36c10.7-10.7,23.6-16,38.8-16c15.2,0,28.2,5.3,38.8,16c10.7,10.7,16,23.6,16,38.8
                                            			s-5.3,28.2-16,38.8l36,36c7,7,15.7,10.6,25.8,10.6c10.2,0,18.8-3.5,25.8-10.6l259-259.2c7-7,10.6-15.7,10.6-25.8
                                            			C481.1,175.3,477.6,166.6,470.5,159.6z M393.1,216.7L216.7,393.1c-3.4,3.4-7.7,5.1-12.8,5.1c-5.1,0-9.4-1.7-12.8-5.1L87.7,289.8
                                            			c-3.6-3.6-5.4-7.9-5.4-12.8c0-4.9,1.8-9.2,5.4-12.9L264.1,87.7c3.4-3.4,7.7-5.1,12.9-5.1c5.1,0,9.4,1.7,12.8,5.1L393.1,191
                                            			c3.6,3.6,5.4,7.9,5.4,12.9C398.6,208.8,396.8,213.1,393.1,216.7z"/>
                                            		<path class="ticket-path" d="M277,113.6l90.2,90.2L203.9,367.2l-90.2-90.2L277,113.6z"/>
                                            	</g>
                                            </g>
                                            </svg></a>
                                      </div>
                                  </div>
                                  {this.state.toEmailModalOpen ? (
                                      <div id="open-modal" className="modal-window">
                                          <div>
                                              <a href="/" title="Close" className="modal-close">
                                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                	 viewBox="0 0 52 52" className="error-svg close-icon">
                                                <g>
                                                	<path  d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26
                                                		S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"/>
                                                	<path d="M35.707,16.293c-0.391-0.391-1.023-0.391-1.414,0L26,24.586l-8.293-8.293c-0.391-0.391-1.023-0.391-1.414,0
                                                		s-0.391,1.023,0,1.414L24.586,26l-8.293,8.293c-0.391,0.391-0.391,1.023,0,1.414C16.488,35.902,16.744,36,17,36
                                                		s0.512-0.098,0.707-0.293L26,27.414l8.293,8.293C34.488,35.902,34.744,36,35,36s0.512-0.098,0.707-0.293
                                                		c0.391-0.391,0.391-1.023,0-1.414L27.414,26l8.293-8.293C36.098,17.316,36.098,16.684,35.707,16.293z"/>
                                                </g>
                                                </svg>
                                              </a>
                                              <form className="form">
                                                  <div className="form-group">
                                                      <label for="exampleFormControlInput1">Email address</label>
                                                      <input
                                                          type="email"
                                                          className="form-control"
                                                          id="exampleFormControlInput1"
                                                          placeholder="Your E-Mail Address"
                                                          value={this.state.toEmailAddress}
                                                          onInput={handleToEmailAddressChange}
                                                      />
                                                  </div>
                                                  {/* <input type="email" class="form__field" placeholder="Your E-Mail Address" /> */}
                                                  <div className="d-flex justify-content-center">
                                                      <button type="button"
                                                              onClick={() => this.sendEmail(this.state.conversation, this.publishSocket, this.state.toEmailAddress)}
                                                              className="btn btn--primary btn--inside uppercase">Send</button>
                                                      <button href="#" type="button" onClick={() => handleEmailModalClick(false)}
                                                              className="btn btn--danger btn--inside uppercase "
                                                      >
                                                          Close
                                                      </button>
                                                  </div>
                                              </form>
                                          </div>
                                      </div>
                                  ):(
                                      ""
                                  )}
                                  {this.state.isJiraModalOpened ? (
                                      <div id="open-jira-modal" className="modal-window">
                                          <div>
                                              <a href="/" title="Close" className="modal-close">
                                              <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                	 viewBox="0 0 52 52" className="error-svg close-icon">
                                                <g>
                                                	<path  d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26
                                                		S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"/>
                                                	<path d="M35.707,16.293c-0.391-0.391-1.023-0.391-1.414,0L26,24.586l-8.293-8.293c-0.391-0.391-1.023-0.391-1.414,0
                                                		s-0.391,1.023,0,1.414L24.586,26l-8.293,8.293c-0.391,0.391-0.391,1.023,0,1.414C16.488,35.902,16.744,36,17,36
                                                		s0.512-0.098,0.707-0.293L26,27.414l8.293,8.293C34.488,35.902,34.744,36,35,36s0.512-0.098,0.707-0.293
                                                		c0.391-0.391,0.391-1.023,0-1.414L27.414,26l8.293-8.293C36.098,17.316,36.098,16.684,35.707,16.293z"/>
                                                </g>
                                                </svg>
                                              </a>
                                              <form className="form">
                                                  <div className="form-group">
                                                      <label for="exampleFormControlSelect1">Issue Type</label>
                                                      <select className="form-control" id="exampleFormControlSelect1" value={this.state.selectedItemType}
                                                              onChange={
                                                                  (e) => this.setState({selectedItemType: e.target.value})
                                                              }>
                                                          {this.state.jira.map((itemType) => <option key={itemType.itemValue} value={itemType.itemValue}>{itemType.itemValue}</option>)}
                                                      </select>

                                                      {/*<select className="form-control" id="exampleFormControlSelect1">
                      <option>Story</option>
                      <option>Task</option>
                      <option>Epic</option>
                      <option >Bug</option>
                    </select>*/}
                                                  </div>
                                                  <div className="form-group">
                                                      <label htmlFor="exampleFormControlTextarea2">Summary</label>
                                                      <textarea className="form-control" id="exampleFormControlTextarea2" value={this.state.summary}
                                                                onInput={handleJiraSummaryChange}/>
                                                  </div>
                                                  <div className="form-group">
                                                      <label for="exampleFormControlTextarea1">Description</label>
                                                      <textarea className="form-control" id="exampleFormControlTextarea1" value={this.state.description}
                                                                onInput={handleJiraDescriptionChange}/>
                                                  </div>

                                                  <div className="d-flex justify-content-center">
                                                      <button onClick={() => this.createJira(this.state.selectedItemType, this.state.summary, this.state.description, this.publishSocket)}
                                                              type="button" className="btn btn--primary btn--inside uppercase">Create</button>
                                                      <button href="#" type="button" className="btn btn--danger btn--inside uppercase" onClick={() => handleJiraModalClick(false)} >Close</button>
                                                  </div>
                                              </form>
                                          </div>
                                      </div>
                                  ):(
                                      ""
                                  )}
                              </div>
                              {this.state.isAuthenticated  ? (
                                <div>
                              <ScrollToBottom className="conversation-view ">

                                  <div  id={'chathistory'}>{chat}</div>
                                  <div className="ticontainer">
                                      <div className="tiblock">
                                          <div className="tidot"></div>
                                          <div className="tidot"></div>
                                          <div className="tidot"></div>
                                      </div>
                                  </div>
                              </ScrollToBottom>
                              <form onSubmit={this.handleSubmit} style={{background:"#fff"}}>
                                  <input
                                      value={this.state.userMessage}
                                      onInput={this.handleChange}
                                      className="css-input"
                                      type="text"
                                      autoFocus
                                      placeholder="Type your message and hit Enter to send"    />
                              </form>
                              </div>
                      ):(
                          <div>
                          <div className="conversation-view">
                        <div id="open-login-modal" className="slide-fwd-top modal-login  modal-login-window d-flex justify-content-center">
                      <div >
                          <div className="modal-text">
                              <h3 className="modal-header">Welcome Back</h3>
                              <p className="model-subtitle">Sign in to start the chat application. Chat application will allow to send the chat history to email and create Jira issue. </p>
                              <FacebookLogin
                                  appId="371181973549385" //APP ID NOT CREATED YET
                                  // fields="name,email,picture"
                                  callback={responseFacebook}
                                  render={renderProps => (
                                      <button className="btn--primary--outline uppercase" onClick={renderProps.onClick}  disabled={renderProps.disabled}>
                                      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                        	 viewBox="0 0 408.788 408.788" className="fb-svg" width="18px" height="18px">
                                        <path className="fb-path" d="M353.701,0H55.087C24.665,0,0.002,24.662,0.002,55.085v298.616c0,30.423,24.662,55.085,55.085,55.085
                                        	h147.275l0.251-146.078h-37.951c-4.932,0-8.935-3.988-8.954-8.92l-0.182-47.087c-0.019-4.959,3.996-8.989,8.955-8.989h37.882
                                        	v-45.498c0-52.8,32.247-81.55,79.348-81.55h38.65c4.945,0,8.955,4.009,8.955,8.955v39.704c0,4.944-4.007,8.952-8.95,8.955
                                        	l-23.719,0.011c-25.615,0-30.575,12.172-30.575,30.035v39.389h56.285c5.363,0,9.524,4.683,8.892,10.009l-5.581,47.087
                                        	c-0.534,4.506-4.355,7.901-8.892,7.901h-50.453l-0.251,146.078h87.631c30.422,0,55.084-24.662,55.084-55.084V55.085
                                        	C408.786,24.662,384.124,0,353.701,0z"/>
                                        </svg>
                                      Login with facebook</button>
                                  )}
                              />
                              <GoogleLogin
                                  clientId="235633224678-u1p6ic082dvu78imce7hv47pc8kh0vfo.apps.googleusercontent.com"
                                  render={renderProps => (
                                      <button className="btn--primary--outline uppercase" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"x="0px" y="0px"
                                        	 viewBox="0 0 512 512" className="g-svg" width="18px" height="18px">
                                        <path className="g-path-1" d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	C103.821,274.792,107.225,292.797,113.47,309.408z"/>
                                        <path className="g-path-2" d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"/>
                                        <path className="g-path-3" d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"/>
                                        <path className="g-path-4" d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	C318.115,0,375.068,22.126,419.404,58.936z"/>
                                        </svg>

                                      Login with Google</button>
                                  )}
                                  buttonText="Login"
                                  onSuccess={responseGoogle}
                                  onFailure={responseGoogle}
                                  cookiePolicy={'single_host_origin'}
                              />
                              {/* <button type="button" className="btn btn--primary--outline">LOGIN WITH GOOGLE</button> */}
                          </div>
                         
                      </div>
                     
                  </div>
                  
                  </div>
                  <div className="unauth-input">
                                    
                                    </div>
                                    </div>
                      )}
              

          </div>
          ):( 
               ""
              )}
         </div>
         </div>
         </div>
        </BrowserRouter>
      );
  }
}
