import * as React from "react";
import PropTypes from "prop-types";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import Sidebar from "./Sidebar";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactVoiceInput from 'react-voice-input';
// import Form from 'react-bootstrap/Form';
import "./Styles/Sidebar.css";
// import './Styles/ChatApp.css';
// import closeIcon from './error.svg';
// import mailIdIcon from './sendmail.svg';
// import jiraTicketIcon from './ticket.svg';
// import FacebookIcon from './facebook.svg';
// import googleIcon from './search.svg';
// import twitterIcon from './twitter.svg';
// import emailIcon from './email.svg';
// import convIcon from './chat.svg';

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";

import ScrollToBottom from "react-scroll-to-bottom";
//import 'bootstrap/dist/css/bootstrap.css';
import GridDetail from "./Components/GridDetail";
import GraphComponent from "./Components/Graph";
import "./Styles/ChatApp.css";
import IdleTimer from "react-idle-timer";

export class ChatApp extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onHelloEvt: PropTypes.func
  };

  static defaultProps = {
    name: "Test"
  };
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //         graphData:[]
  //     }
  // }
  constructor(props) {
    super(props);
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.state = {
      userMessage: "",
      conversation: [],
      userId: new Date().getTime(),
      toEmailModalOpen: false,
      isJiraModalOpened: false,
      isChatModalOpened: false,
      toEmailAddress: "",
      isAuthenticated: true,
      toPassResponce: [],
      checkResponse: [],
      jira: [
        {
          itemType: "",
          itemValue: ""
        },
        {
          itemType: "Task",
          itemValue: "Task"
        },
        {
          itemType: "Story",
          itemValue: "Story"
        },
        {
          itemType: "Bug",
          itemValue: "Bug"
        }
      ],
      selectedItemType: "",
      summary: "",
      description: ""
    };
    this.onResult = this.onResult.bind(this)
  }
 

  componentDidMount() {
    this.startListenerWebSocketClient();
    this.startPublisherWebSocketClient();
  }

  startListenerWebSocketClient() {
    this.listenSocket = new WebSocket(
      "wss://micro-chatapp-nodered-flow.herokuapp.com/public/messagepublish"
    ); //server publishes
    this.listenSocket.onopen = () => {
      // on connecting, do nothing but log it to the console
    };

    function isHTML(str) {
      var doc = new DOMParser().parseFromString(str, "text/html");
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    }

    function convertToMessage(str) {
      let convertedMessage = "";
      // let tempstrtype=JSON.parse(str);
      if (typeof str == "string") {
        try {
          let tempstr = JSON.parse(str);
          convertedMessage = tempstr.Object.keys(tempstr[0]);
        } catch (e) {
          convertedMessage = str;
        }
        // convertedMessage=str;
      } else {
        try {
          let tempstr = JSON.stringify(str);
          JSON.parse(tempstr);
          convertedMessage = tempstr;
        } catch (e) {
          convertedMessage = str;
        }
      }
      console.log("and the message is " + convertedMessage);
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
      let response = JSON.parse(event.data.trim());
      // console.log(response.data);
      // this.checkResponse=response.data;
      if (isJson(response.data)) {
        this.toPassResponce =
          response.data !== undefined && response.data !== null
            ? JSON.parse(response.data)
            : response.data;
      } else {
        this.toPassResponce = response.data;
      }
      console.log("------------" + this.toPassResponce);
      if (
        response.data !== undefined &&
        response.data !== null &&
        response.data.indexOf("Error: connect ECONNREFUSED") !== -1
      ) {
        const msg = {
          text: convertToMessage(
            "Some thing went wrong, please try again after some time."
          ),
          user: "ai"
        };
        this.setState({
          conversation: [...this.state.conversation, msg]
        });
      } else if (response.userId === this.state.userId) {
        let message = response.data;
        if (
          isHTML(message) &&
          message.indexOf("Error: connect ECONNREFUSED") !== -1
        ) {
          message = "Some thing went wrong, please try again after some time.";
        }
        const msg = {
          text: convertToMessage(message),
          user: "ai"
        };
        this.setState({
          conversation: [...this.state.conversation, msg]
        });
      }
    };

    this.listenSocket.onclose = () => {
      this.startListenerWebSocketClient();
    };
  }
  startPublisherWebSocketClient() {
    this.publishSocket = new WebSocket(
      "wss://micro-chatapp-nodered-flow.herokuapp.com/public/messagereceive"
    );

    this.publishSocket.onopen = () => {
      // on connecting, do nothing but log it to the console
    };

    this.publishSocket.onmessage = evt => {
      const message = JSON.parse(evt.data);
      this.addMessage(message);
    };

    this.publishSocket.onclose = () => {
      this.startPublisherWebSocketClient();
    };
  }
  submitMessage = messageString => {
    //messageString=encodeURI(messageString);
    const message = {
      channelType: "chatbot",
      message: messageString,
      userId: this.state.userId
    };
    this.publishSocket.send(JSON.stringify(message));
  };
  handleChange = event => {
    this.setState({ userMessage: event.target.value });
  };
  onResult (result) {
    this.setState({
      userMessage: result
    })
    // console.log(result)

  }
  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
      user: "human"
    };

    this.setState({
      conversation: [...this.state.conversation, msg]
    });

    this.submitMessage({
      message: this.state.userMessage
    });

    this.setState({ userMessage: "" });
  };

  handleQuestion = question => {
    let q = question;

    const msg = {
      text: q,
      user: "human"
    };

    this.setState({
      conversation: [...this.state.conversation, msg]
    });

    this.submitMessage({
      message: q
    });
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
    if (event.user === "human") {
      return (
        <div
          key={`${className}-${i + 1}`}
          className={`${className} chat-bubble`}
        >
          <span className="chat-content">{event.text}</span>
        </div>
      );
    } else {
      if (this.isJson(event.text)) {
        const items = JSON.parse(event.text);
        if (typeof items == "object" && Object.keys(items)[0] === "questions") {
          console.log("items of benefits" + items);
          return (
            <div className="question-options">
              {items.questions.map(i => {
                return (
                  <div className="ai chat-bubble justify-null">
                    <button
                      className="chat-content chat-question-options"
                      onClick={() => this.handleQuestion(i)}
                    >
                      {i}
                    </button>
                  </div>
                );
              })}
              {/* <div className="ai chat-bubble">
                                <span className="chat-content">{event.text}</span>
                            </div> */}
            </div>
          );
        } else {
          return (
            <div>
              <div className="card-container">
                {items.map(item => (
                  <span className="card">
                    {Object.keys(item).map(function(key) {
                      return (
                        <div>
                          <h6 className="room-detail">{key}</h6>
                          <span className="room-response">{item[key]}</span>
                        </div>
                      );
                    })}
                  </span>
                ))}
              </div>

              <div
                style={{
                  color: "#fff",
                  fontSize: "10px",
                  textAlign: "center"
                }}
              >
                Scroll to view more
              </div>
            </div>
          );
        }
      } else {
        return (
          <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
            <span className="chat-content">{event.text}</span>
          </div>
        );
      }
    }
  }

  sendEmail(conversation, publisher, toEmail) {
    const message = {
      channelType: "email",
      message: conversation,
      subject: "Chat History",
      to: toEmail
    };
    this.setState({ toEmailModalOpen: false });
    publisher.send(JSON.stringify(message));
  }

  createJira(itemType, itemSummary, itemDescription, publisher) {
    let message = {
      channelType: "jira",
      itemType: itemType,
      itemSummary: itemSummary,
      itemDescription
    };
    this.setState({ isJiraModalOpened: false });
    publisher.send(JSON.stringify(message));
  }

  render() {
    const handleEmailModalClick = toEmailModalOpen => {
      this.setState({ toEmailModalOpen: toEmailModalOpen, toEmailAddress: "" });
    };
    const handleJiraModalClick = isJiraModalOpened => {
      this.setState({ isJiraModalOpened: isJiraModalOpened });
    };
    const handleChatModalClick = isChatModalOpened => {
      this.setState({ isChatModalOpened: !isChatModalOpened });
    };

    const handleToEmailAddressChange = event => {
      this.setState({ toEmailAddress: event.target.value });
    };

    const handleJiraDescriptionChange = event => {
      this.setState({ description: event.target.value });
    };

    const handleJiraSummaryChange = event => {
      this.setState({ summary: event.target.value });
    };
    const responseFacebook = response => {
      if (response.userID !== undefined) {
        this.setState({ isAuthenticated: true });
      }
    };
    const responseGoogle = response => {
      if (response.googleId !== undefined) {
        this.setState({ isAuthenticated: true });
      }
    };
    const ChatBubble = (event, i, className) => {
      return <div>{this.getContent(event, className, i)}</div>;
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e, index, e.user)
    );

    const leftSideWindow = () => {
      if (
        typeof this.toPassResponce === "object" &&
        typeof this.toPassResponce !== undefined
      ) {
        if (Object.keys(this.toPassResponce)[0] === "questions") {
          return (
            <div
              style={{
                paddingLeft: "80px",
                paddingTop: "100px",
                background: "#f5f6fa",
                overflow: "auto"
              }}
            >
              <Row style={{ marginLeft: "0px" }}>
                <Col
                  style={{
                    padding: "0.5%",
                    paddingTop: "10px",
                    maxWidth: "calc(100% - 360px)"
                  }}
                >
                  <Card className="fieldset-chart">
                    <div style={{ width: "90%", margin: "auto" }}>
                      <div>No data to Show</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          );
        } else {
          return (
            <div
              style={{
                paddingLeft: "75px",
                paddingTop: "100px",
                background: "#f5f6fa"
              }}
            >
              {console.log(this.toPassResponce + "Check this Object")}
              {/* {console.log(this.props.location.pathname)} */}
              <Switch>
                <Route
                  exact
                  path="/Graph"
                  component={() => (
                    <GraphComponent response={this.toPassResponce} />
                  )}
                />
                <Route
                  path="/"
                  component={() => (
                    <GridDetail response={this.toPassResponce} />
                  )}
                />
              </Switch>
            </div>
          );
        }
      } else {
        return (
          <div
            style={{
              paddingLeft: "80px",
              paddingTop: "100px",
              background: "#f5f6fa",
              overflow: "auto"
            }}
          >
            <Row style={{ marginLeft: "0px" }}>
              <Col
                style={{
                  padding: "0.5%",
                  paddingTop: "10px",
                  maxWidth: "calc(100% - 360px)"
                }}
              >
                <Card className="fieldset-chart">
                  <div style={{ width: "90%", margin: "auto" }}>
                    <div>No data to Show</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );
      }
    };
    const onEnd = () => {
      console.log('on end')
    }
    return (
      <BrowserRouter>
        <div id="chat">
          <IdleTimer
            ref={ref => {
              this.idleTimer = ref;
            }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={1000 * 60 * 10}
          />
          {/* <div className="col-md-12">
              <h1>{this.props.name}</h1>
              <p onClick={this.editSlogan}>Hello</p>
          </div> */}
          <SideNav onSelect={selected => {}} className="sidebar-custom">
            {/* <SideNav.Toggle /> */}
            <SideNav.Nav>
              <NavItem className="sidebarNavItems" eventKey="charts">
                <NavIcon title="Grid">
                  <Link to="/" style={{ paddingRight: "0" }}>
                    <img
                      src={`data:image/png;base64,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`}
                      alt="icon"
                      className="topnavImgLeft"
                      style={{ width: "2.6em" }}
                    />
                  </Link>
                </NavIcon>
              </NavItem>
              <NavItem className="sidebarNavItems" eventKey="dashboard">
                <NavIcon title="Graph">
                  <Link to="/Graph" style={{ paddingRight: "0" }}>
                    <img
                      src={`data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzY0QjVGNjsiIGQ9Ik0xMTAuNzQxLDI3OC4xNDRjLTMuOTg1LTEuNjU0LTguNTc0LTAuNzQ1LTExLjYyNywyLjMwNEw2NCwzMTUuNTg0bC0zNS4xMTUtMzUuMTM2DQoJYy00LjE2LTQuMTcxLTEwLjkxNC00LjE3OS0xNS4wODUtMC4wMTljLTIuMDExLDIuMDA2LTMuMTM5LDQuNzMxLTMuMTM0LDcuNTcxdjIxMy4zMzNjMCw1Ljg5MSw0Ljc3NiwxMC42NjcsMTAuNjY3LDEwLjY2N2g4NS4zMzMNCgljNS44OTEsMCwxMC42NjctNC43NzYsMTAuNjY3LTEwLjY2N1YyODhDMTE3LjMzMywyODMuNjg0LDExNC43MywyNzkuNzkzLDExMC43NDEsMjc4LjE0NHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiM0MkE1RjU7IiBkPSJNMTk5LjU1MiwxOTUuMTE1Yy00LjE2NS00LjE2NC0xMC45MTctNC4xNjQtMTUuMDgzLDBsLTQyLjY2Nyw0Mi42NjcNCgljLTIuMDA3LDIuMDAxLTMuMTM1LDQuNzE4LTMuMTM2LDcuNTUydjI1NmMwLDUuODkxLDQuNzc2LDEwLjY2NywxMC42NjcsMTAuNjY3aDg1LjMzM2M1Ljg5MSwwLDEwLjY2Ny00Ljc3NiwxMC42NjctMTAuNjY3di0yNTYNCgljMC4wMDUtMi44MzEtMS4xMTUtNS41NDgtMy4xMTUtNy41NTJMMTk5LjU1MiwxOTUuMTE1eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzIxOTZGMzsiIGQ9Ik0zMjcuNTUyLDE1Mi40NDhjLTQuMTY1LTQuMTY0LTEwLjkxNy00LjE2NC0xNS4wODMsMGwtNDIuNjY3LDQyLjY2Nw0KCWMtMi4wMDcsMi4wMDEtMy4xMzUsNC43MTgtMy4xMzYsNy41NTJ2Mjk4LjY2N2MwLDUuODkxLDQuNzc2LDEwLjY2NywxMC42NjcsMTAuNjY3aDg1LjMzM2M1Ljg5MSwwLDEwLjY2Ny00Ljc3NiwxMC42NjctMTAuNjY3DQoJVjIwMi42NjdjMC4wMDUtMi44MzEtMS4xMTUtNS41NDgtMy4xMTUtNy41NTJMMzI3LjU1MiwxNTIuNDQ4eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzE5NzZEMjsiIGQ9Ik00OTguMjE5LDEzMS4xMTVsLTIxLjMzMy0yMS4zMzNjLTIuMDA0LTEuOTk5LTQuNzIxLTMuMTItNy41NTItMy4xMTVINDQ4DQoJYy0yLjgzMS0wLjAwNS01LjU0OCwxLjExNS03LjU1MiwzLjExNWwtNDIuNjY3LDQyLjY2N2MtMS45OTksMi4wMDQtMy4xMiw0LjcyMS0zLjExNSw3LjU1MnYzNDEuMzMzDQoJYzAsNS44OTEsNC43NzYsMTAuNjY3LDEwLjY2NywxMC42NjdoODUuMzMzYzUuODkxLDAsMTAuNjY3LTQuNzc2LDEwLjY2Ny0xMC42NjdWMTM4LjY2Nw0KCUM1MDEuMzM4LDEzNS44MzYsNTAwLjIxOCwxMzMuMTE5LDQ5OC4yMTksMTMxLjExNXoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiM0NTVBNjQ7IiBkPSJNNDkwLjY2NywwaC02NGMtNS44OTEtMC4wMTEtMTAuNjc1LDQuNzU3LTEwLjY4NiwxMC42NDhjLTAuMDA1LDIuODQsMS4xMjMsNS41NjUsMy4xMzQsNy41NzENCglsMjQuNDY5LDI0LjQ0OGwtODAuOTE3LDgwLjkxN2wtMzUuMTE1LTM1LjEzNmMtNC4xNjUtNC4xNjQtMTAuOTE3LTQuMTY0LTE1LjA4MywwbC03Ny44MDMsNzcuODAzbC0zNS4xMTUtMzUuMTM2DQoJYy00LjE2NS00LjE2NC0xMC45MTctNC4xNjQtMTUuMDgzLDBMNjQsMjUxLjU4NGwtMzUuMTE1LTM1LjEzNmMtNC4yMzctNC4wOTMtMTAuOTktMy45NzUtMTUuMDgzLDAuMjYyDQoJYy0zLjk5Miw0LjEzNC0zLjk5MiwxMC42ODcsMCwxNC44Mmw0Mi42NjcsNDIuNjY3YzQuMTY1LDQuMTY0LDEwLjkxNyw0LjE2NCwxNS4wODMsMEwxOTIsMTUzLjc0OWwzNS4xMTUsMzUuMTE1DQoJYzQuMTY1LDQuMTY0LDEwLjkxNyw0LjE2NCwxNS4wODMsMEwzMjAsMTExLjA4M2wzNS4xMTUsMzUuMTE1YzQuMTY1LDQuMTY0LDEwLjkxNyw0LjE2NCwxNS4wODMsMGw4OC40NjktODguNDQ4bDI0LjQ0OCwyNC40NDgNCgljMi4wMDEsMi4wMDcsNC43MTgsMy4xMzUsNy41NTIsMy4xMzZjMS4zOTksMC4wMDMsMi43ODQtMC4yNzMsNC4wNzUtMC44MTFjMy45ODktMS42NDksNi41OTEtNS41MzksNi41OTItOS44NTZ2LTY0DQoJQzUwMS4zMzMsNC43NzYsNDk2LjU1OCwwLDQ5MC42NjcsMHoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K`}
                      alt="Analytics"
                      style={{ width: "2.6em" }}
                    />
                  </Link>
                </NavIcon>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
          {/* {this.toPassResponce.length>1? */}
          {/* && Object.keys(this.toPassResponce[0])[0] */}
          <div>{leftSideWindow()}</div>

          <div style={{ maxHeight: "calc(100% - 40px)" }}>
            <div
              className="animate-chat chat-button-theme-bubble"
              title="Click to Talk"
            >
              <div className="button-greeting">
                <div className="button-greeting-close">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                  </svg>
                </div>
              </div>
              <div
                className="chat-button pulse"
                onClick={() =>
                  handleChatModalClick(this.state.isChatModalOpened)
                }
              >
                {/* <img className="chat-icon" src={convIcon}/> */}
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 477.6 477.6"
                  className="chat-svg"
                  width="60%"
                  height="60%"
                >
                  <g>
                    <g>
                      <path
                        className="mail-path"
                        d="M407.583,70c-45.1-45.1-105-70-168.8-70s-123.7,24.9-168.8,70c-87,87-93.3,226-15.8,320.2c-10.7,21.9-23.3,36.5-37.6,43.5
                        			c-8.7,4.3-13.6,13.7-12.2,23.3c1.5,9.7,8.9,17.2,18.6,18.7c5.3,0.8,11,1.3,16.9,1.3l0,0c29.3,0,60.1-10.1,85.8-27.8
                        			c34.6,18.6,73.5,28.4,113.1,28.4c63.8,0,123.7-24.8,168.8-69.9s69.9-105.1,69.9-168.8S452.683,115.1,407.583,70z M388.483,388.5
                        			c-40,40-93.2,62-149.7,62c-37.8,0-74.9-10.1-107.2-29.1c-2.1-1.2-4.5-1.9-6.8-1.9c-2.9,0-5.9,1-8.3,2.8
                        			c-30.6,23.7-61.4,27.2-74.9,27.5c16.1-12,29.6-30.6,40.9-56.5c2.1-4.8,1.2-10.4-2.3-14.4c-74-83.6-70.1-211,8.9-290
                        			c40-40,93.2-62,149.7-62s109.7,22,149.7,62C471.083,171.6,471.083,306,388.483,388.5z"
                      />
                      <path
                        className="mail-path"
                        d="M338.783,160h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,160,338.783,160z"
                      />
                      <path
                        className="mail-path"
                        d="M338.783,225.3h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,225.3,338.783,225.3z"
                      />
                      <path
                        className="mail-path"
                        d="M338.783,290.6h-200c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h200c7.5,0,13.5-6,13.5-13.5S346.183,290.6,338.783,290.6z"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div>
              {this.state.isChatModalOpened ? (
                <div
                  id="chatbot-open"
                  className=" slide-top chat-window chat-modal-window"
                >
                  <div className="chat-heading">
                    <h1
                      className="animate-chat pacifino"
                      style={{ color: "#fff" }}
                    >
                      Log N Solve
                    </h1>
                    <div className="interior">
                      <div>
                        {/* <button type="button" className="btn btn-primary"  data-toggle="modal" data-target="#exampleModalCenter">Login</button> */}
                        {/* <img className="mail-box" onClick={() => this.sendEmail(this.state.conversation, this.publishSocket)} src={mailIcon} title="Send Conversation"/> */}
                        <a href="#open-modal">
                          <svg
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 512 512"
                            className="mail-svg mailId-box"
                            title="Enter Your Mail"
                            onClick={() => handleEmailModalClick(true)}
                          >
                            <g>
                              <g>
                                <polygon
                                  className="mail-path"
                                  points="119.988,365.064 119.988,492 396.949,122.719"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  className="mail-path"
                                  d="M8.279,243.581c-10.502,5.251-11.149,20.025-1.157,26.191l103.449,63.668l376.6-331.862L488.356,0L8.279,243.581z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  className="mail-path"
                                  d="M509.239,22.136L224.05,403.264l173.071,106.509c8.793,5.44,20.641,0.461,22.603-10.005L512,19.719L509.239,22.136z"
                                />
                              </g>
                            </g>
                          </svg>

                          {/* <img className="mailId-box" src={mailIdIcon}/> */}
                        </a>
                        <a href="#open-jira-modal">
                          <svg
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 481.1 481.1"
                            className="ticket-svg mailId-box"
                            onClick={() => handleJiraModalClick(true)}
                            title="Jira"
                          >
                            <g>
                              <g>
                                <path
                                  className="ticket-path"
                                  d="M470.5,159.6l-36-35.7c-10.7,10.7-23.6,16-38.8,16c-15.2,0-28.2-5.3-38.8-16c-10.7-10.7-16-23.6-16-38.8
                                            			c0-15.2,5.3-28.2,16-38.8l-35.7-35.7c-7-7-15.7-10.6-25.8-10.6c-10.2,0-18.8,3.5-25.8,10.6l-259,258.7c-7,7-10.6,15.7-10.6,25.8
                                            			c0,10.2,3.5,18.8,10.6,25.8l35.7,36c10.7-10.7,23.6-16,38.8-16c15.2,0,28.2,5.3,38.8,16c10.7,10.7,16,23.6,16,38.8
                                            			s-5.3,28.2-16,38.8l36,36c7,7,15.7,10.6,25.8,10.6c10.2,0,18.8-3.5,25.8-10.6l259-259.2c7-7,10.6-15.7,10.6-25.8
                                            			C481.1,175.3,477.6,166.6,470.5,159.6z M393.1,216.7L216.7,393.1c-3.4,3.4-7.7,5.1-12.8,5.1c-5.1,0-9.4-1.7-12.8-5.1L87.7,289.8
                                            			c-3.6-3.6-5.4-7.9-5.4-12.8c0-4.9,1.8-9.2,5.4-12.9L264.1,87.7c3.4-3.4,7.7-5.1,12.9-5.1c5.1,0,9.4,1.7,12.8,5.1L393.1,191
                                            			c3.6,3.6,5.4,7.9,5.4,12.9C398.6,208.8,396.8,213.1,393.1,216.7z"
                                />
                                <path
                                  class="ticket-path"
                                  d="M277,113.6l90.2,90.2L203.9,367.2l-90.2-90.2L277,113.6z"
                                />
                              </g>
                            </g>
                          </svg>
                        </a>
                      </div>
                    </div>
                    {this.state.toEmailModalOpen ? (
                      <div id="open-modal" className="modal-window">
                        <div>
                          <a href="/" title="Close" className="modal-close">
                            <svg
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              viewBox="0 0 52 52"
                              className="error-svg close-icon"
                            >
                              <g>
                                <path
                                  d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26
                                                		S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"
                                />
                                <path
                                  d="M35.707,16.293c-0.391-0.391-1.023-0.391-1.414,0L26,24.586l-8.293-8.293c-0.391-0.391-1.023-0.391-1.414,0
                                                		s-0.391,1.023,0,1.414L24.586,26l-8.293,8.293c-0.391,0.391-0.391,1.023,0,1.414C16.488,35.902,16.744,36,17,36
                                                		s0.512-0.098,0.707-0.293L26,27.414l8.293,8.293C34.488,35.902,34.744,36,35,36s0.512-0.098,0.707-0.293
                                                		c0.391-0.391,0.391-1.023,0-1.414L27.414,26l8.293-8.293C36.098,17.316,36.098,16.684,35.707,16.293z"
                                />
                              </g>
                            </svg>
                          </a>
                          <form className="form">
                            <div className="form-group">
                              <label for="exampleFormControlInput1">
                                Email address
                              </label>
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
                              <button
                                type="button"
                                onClick={() =>
                                  this.sendEmail(
                                    this.state.conversation,
                                    this.publishSocket,
                                    this.state.toEmailAddress
                                  )
                                }
                                className="btn btn--primary btn--inside uppercase"
                              >
                                Send
                              </button>
                              <button
                                href="#"
                                type="button"
                                onClick={() => handleEmailModalClick(false)}
                                className="btn btn--danger btn--inside uppercase "
                              >
                                Close
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.isJiraModalOpened ? (
                      <div id="open-jira-modal" className="modal-window">
                        <div>
                          <a href="/" title="Close" className="modal-close">
                            <svg
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              viewBox="0 0 52 52"
                              className="error-svg close-icon"
                            >
                              <g>
                                <path
                                  d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26
                                                		S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"
                                />
                                <path
                                  d="M35.707,16.293c-0.391-0.391-1.023-0.391-1.414,0L26,24.586l-8.293-8.293c-0.391-0.391-1.023-0.391-1.414,0
                                                		s-0.391,1.023,0,1.414L24.586,26l-8.293,8.293c-0.391,0.391-0.391,1.023,0,1.414C16.488,35.902,16.744,36,17,36
                                                		s0.512-0.098,0.707-0.293L26,27.414l8.293,8.293C34.488,35.902,34.744,36,35,36s0.512-0.098,0.707-0.293
                                                		c0.391-0.391,0.391-1.023,0-1.414L27.414,26l8.293-8.293C36.098,17.316,36.098,16.684,35.707,16.293z"
                                />
                              </g>
                            </svg>
                          </a>
                          <form className="form">
                            <div className="form-group">
                              <label for="exampleFormControlSelect1">
                                Issue Type
                              </label>
                              <select
                                className="form-control"
                                id="exampleFormControlSelect1"
                                value={this.state.selectedItemType}
                                onChange={e =>
                                  this.setState({
                                    selectedItemType: e.target.value
                                  })
                                }
                              >
                                {this.state.jira.map(itemType => (
                                  <option
                                    key={itemType.itemValue}
                                    value={itemType.itemValue}
                                  >
                                    {itemType.itemValue}
                                  </option>
                                ))}
                              </select>

                              {/*<select className="form-control" id="exampleFormControlSelect1">
                      <option>Story</option>
                      <option>Task</option>
                      <option>Epic</option>
                      <option >Bug</option>
                    </select>*/}
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleFormControlTextarea2">
                                Summary
                              </label>
                              <textarea
                                className="form-control"
                                id="exampleFormControlTextarea2"
                                value={this.state.summary}
                                onInput={handleJiraSummaryChange}
                              />
                            </div>
                            <div className="form-group">
                              <label for="exampleFormControlTextarea1">
                                Description
                              </label>
                              <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                value={this.state.description}
                                onInput={handleJiraDescriptionChange}
                              />
                            </div>

                            <div className="d-flex justify-content-center">
                              <button
                                onClick={() =>
                                  this.createJira(
                                    this.state.selectedItemType,
                                    this.state.summary,
                                    this.state.description,
                                    this.publishSocket
                                  )
                                }
                                type="button"
                                className="btn btn--primary btn--inside uppercase"
                              >
                                Create
                              </button>
                              <button
                                href="#"
                                type="button"
                                className="btn btn--danger btn--inside uppercase"
                                onClick={() => handleJiraModalClick(false)}
                              >
                                Close
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {this.state.isAuthenticated ? (
                    <div>
                      <ScrollToBottom className="conversation-view ">
                        <div id={"chathistory"}>{chat}</div>
                        <div className="ticontainer">
                          <div className="tiblock">
                            <div className="tidot"></div>
                            <div className="tidot"></div>
                            <div className="tidot"></div>
                          </div>
                        </div>
                      </ScrollToBottom>
                      <form
                        onSubmit={this.handleSubmit}
                        style={{ background: "#fff" ,height: '50px', borderRadius: '10px'}}
                      >
                      <ReactVoiceInput
                       onResult={this.onResult}
                       onEnd={onEnd}
                       onSpeechStart={console.log("started")}
                      >
                        <input
                          value={this.state.userMessage}
                          onInput={this.handleChange}
                          className="css-input"
                          type="text"
                          autoFocus
                          placeholder="Type your message and hit Enter to send"
                        />
                        </ReactVoiceInput>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="conversation-view">
                        <div
                          id="open-login-modal"
                          className="slide-fwd-top modal-login  modal-login-window d-flex justify-content-center"
                        >
                          <div>
                            <div className="modal-text">
                              <h3 className="modal-header">Welcome Back</h3>
                              <p className="model-subtitle">
                                Sign in to start the chat application. Chat
                                application will allow to send the chat history
                                to email and create Jira issue.{" "}
                              </p>
                              <FacebookLogin
                                appId="371181973549385" //APP ID NOT CREATED YET
                                // fields="name,email,picture"
                                callback={responseFacebook}
                                render={renderProps => (
                                  <button
                                    className="btn--primary--outline uppercase"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                  >
                                    <svg
                                      version="1.1"
                                      id="Layer_1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      x="0px"
                                      y="0px"
                                      viewBox="0 0 408.788 408.788"
                                      className="fb-svg"
                                      width="18px"
                                      height="18px"
                                    >
                                      <path
                                        className="fb-path"
                                        d="M353.701,0H55.087C24.665,0,0.002,24.662,0.002,55.085v298.616c0,30.423,24.662,55.085,55.085,55.085
                                        	h147.275l0.251-146.078h-37.951c-4.932,0-8.935-3.988-8.954-8.92l-0.182-47.087c-0.019-4.959,3.996-8.989,8.955-8.989h37.882
                                        	v-45.498c0-52.8,32.247-81.55,79.348-81.55h38.65c4.945,0,8.955,4.009,8.955,8.955v39.704c0,4.944-4.007,8.952-8.95,8.955
                                        	l-23.719,0.011c-25.615,0-30.575,12.172-30.575,30.035v39.389h56.285c5.363,0,9.524,4.683,8.892,10.009l-5.581,47.087
                                        	c-0.534,4.506-4.355,7.901-8.892,7.901h-50.453l-0.251,146.078h87.631c30.422,0,55.084-24.662,55.084-55.084V55.085
                                        	C408.786,24.662,384.124,0,353.701,0z"
                                      />
                                    </svg>
                                    Login with facebook
                                  </button>
                                )}
                              />
                              <GoogleLogin
                                clientId="1056030506768-0u14k1us6nljrjcr1j1qtq6fd9hm550u.apps.googleusercontent.com"
                                render={renderProps => (
                                  <button
                                    className="btn--primary--outline uppercase"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                  >
                                    <svg
                                      version="1.1"
                                      id="Layer_1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      x="0px"
                                      y="0px"
                                      viewBox="0 0 512 512"
                                      className="g-svg"
                                      width="18px"
                                      height="18px"
                                    >
                                      <path
                                        className="g-path-1"
                                        d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	                                        c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	                                        C103.821,274.792,107.225,292.797,113.47,309.408z"
                                      />
                                      <path
                                        className="g-path-2"
                                        d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	                                        c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	                                        c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                                      />
                                      <path
                                        className="g-path-3"
                                        d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	                                         c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	                                         c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                                      />
                                      <path
                                        className="g-path-4"
                                        d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	                                        c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	                                        C318.115,0,375.068,22.126,419.404,58.936z"
                                      />
                                    </svg>
                                    Login with Google
                                  </button>
                                )}
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={"single_host_origin"}
                              />
                              {/* <button type="button" className="btn btn--primary--outline">LOGIN WITH GOOGLE</button> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="unauth-input"></div>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
  _onAction(e) {
    // console.log('user did something', e)
  }

  _onActive(e) {
    // console.log('user is active', e)
    // console.log('time remaining', this.idleTimer.getRemainingTime())
  }

  _onIdle(e) {
    // console.log('user is idle', e)
    // console.log('last active', this.idleTimer.getLastActiveTime())
    this.setState({ isAuthenticated: false });
    this.setState({ toPassResponce: [] });
    window.location.reload();
  }
}
