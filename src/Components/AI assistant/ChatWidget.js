import React, { Fragment, Component } from 'react';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import io from 'socket.io-client'
import SendIcon from '@material-ui/icons/Send';
import { Card, Button } from 'react-bootstrap';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';


const socket = io(process.env.REACT_APP_VEGA_ROUTER_URL);
console.log(process.env.REACT_APP_VEGA_ROUTER_URL);
let reply = "Here's what i found";
var buttonDiv = document.createElement('div');
buttonDiv.id = "buttonDiv";
let contacts = document.createElement('div')
contacts.className = 'contacts';
contacts.id = 'contact-list';
let discussions = document.createElement('div')
discussions.className = 'discussions';
discussions.id = 'discussion-list';
let courses = document.createElement('div')
courses.className = 'courses';
courses.id = 'course-list';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Here's what i found", domain: 'Vega', message: '', data: {}, activeBots: [], allBots: [], showReponse:'', showAvatar: true, buttons: {}
    };
    this.startArticle = this.startArticle.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.formatResponse = this.formatResponse.bind(this);
  }

  componentDidMount() {
    this.socketConnect();
  }
  socketConnect() 
  {
    socket.on("bot_uttered", (data) => {
      if (data.text === '' || data.text === undefined) {

      }
      else if (data.buttons === '' || data.buttons === undefined) {

        if(data.type === 'contact')
        {
          reply = "Here's what i found"
          this.setState({ text: reply })
          if(document.getElementById('contact-list'))
          {
            document.getElementById('contact-list').innerHTML = '';
          }
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          this.contact((data.text[i]))
        }
        b.appendChild(contacts);
        }
        else if (!(data.type))
        {
          this.setState({ text: data.text })
        }
        else if(data.type === 'discussions')
        {

          if(document.getElementById('discussion-list'))
          {
            document.getElementById('discussion-list').innerHTML = '';
          }
         
          reply = "Here's what i found"
          this.setState({ text: reply })
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          this.discussions((data.text[i]))
        }
        b.appendChild(discussions);
        this.updateScroll()
        }
        else if(data.type === 'updiscussions')
        {

          if(document.getElementById('discussion-list'))
          {
            document.getElementById('discussion-list').innerHTML = '';
          }
         
          reply = "Here's what i found"
          this.setState({ text: reply })
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          this.updiscussions((data.text[i]))
        }
        b.appendChild(discussions);
        this.updateScroll()
        }
        else if(data.type === 'course')
        {
          reply = "Here's what i found"
          this.setState({ text: reply })
          if(document.getElementById('course-list'))
          {
            document.getElementById('course-list').innerHTML = '';
          }
          
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          this.course((data.text[i]))
        }
        b.appendChild(courses);
        this.updateScroll()
        }
        else if(data.type === 'tags')
        {
          this.list(data.type, data.text, "msg-remote")
        }
        else if(data.type === 'list')
        {
          this.list(data.type, data.text, "msg-remote")
        }
        // else if(data.type === 't_tags')
        // {
        //   console.log(data.text)
        //   this.setState({ text: data.text})
        // }
        else if(data.type === 'direct')
        {
          reply = data.text;
          this.setState({ text: reply })
        }
      }
      else {
        var b = document.getElementById("chatWindow");
        for (var i = 0; i < data.buttons.length; i++) 
        {
          this.tags((data.buttons[i].title))
        }
        b.appendChild(buttonDiv);
      }
    });
    this.setState({ text: "Here's what i found" })
  }

  list(type,value,cname)
  {
    this.setState({text: "Here's what i found"})
    var less = document.createElement('span');
    less.id = "readless";
    less.className = "readMore";
    var tmpr = document.createTextNode('Read less ▲');
    var more = document.createElement('span');
    more.id = "readmore";
    more.className = "readMore";
    var tmp = document.createTextNode("Read more ▼");
    if(type === 'tags')
    {
      var heading = "The following are the trending tags: \n";
      value.shift();
      value = this.formatResponse(value)
    }
    else
    {
      var heading = "The competencies are as follows: \n";
      value = this.formatResponseList(value)
    }
    value = String(value).replaceAll(",",'')
    value = heading + "\n" + value;
    var actRespone = value;
    var shortRes = value.substr(0, 50);
    shortRes = shortRes + "...";
    this.setState({showReponse:shortRes});
    var b = document.getElementById("chatWindow");
    var a = document.createElement("article");
    a.className = "msg-container";
    a.classList.add(cname);
    a.id = "msg-0";
    var c = document.createElement("div");
    c.className = "msg-box";
    b.appendChild(a);
    a.appendChild(c);
    c.appendChild(document.createTextNode(this.state.showReponse));
    more.appendChild(tmp);
    c.appendChild(more);
    more.onclick = (e) => {this.setState({showReponse:actRespone});c.innerText= actRespone; less.appendChild(tmpr); c.appendChild(less); this.updateScroll()}
    less.onclick = (e) =>{this.setState({showReponse:shortRes}); c.innerText= shortRes; c.appendChild(more); this.updateScroll()}
  }

  contact(data)
  {
    let card = document.createElement('div');
    card.className = 'contact-card';
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    let cheader = document.createElement('div');
    cheader.className = 'cheader';
    let cname = document.createElement('div');
    cname.className = 'cname';
    var fn = '';
    var ln = '';
    if(data && data.profileDetails && data.profileDetails.personalDetails && data.profileDetails.personalDetails.firstname !== null || data.profileDetails.personalDetails.firstname !== "")
    {
      fn = data.profileDetails.personalDetails.firstname.charAt(0);
    }
    if(data && data.profileDetails && data.profileDetails.personalDetails && data.profileDetails.personalDetails.surname !== null || data.profileDetails.personalDetails.surname !== "" )
    {
      ln = data.profileDetails.personalDetails.surname.charAt(0);
    }
    cname.innerText = fn + ln;
    cheader.appendChild(cname);
    cardBody.appendChild(cheader)
    let cbody = document.createElement('div');
    cbody.className = 'cbody';
    let ctitle = document.createElement('div');
    ctitle.innerText = data.profileDetails.personalDetails.firstname + " " + data.profileDetails.personalDetails.surname;
    cbody.appendChild(ctitle);
    let cdept = document.createElement('div');
    cdept.innerText = data.profileDetails.employmentDetails.departmentName
    cbody.appendChild(cdept);
    cardBody.appendChild(cbody);
    contacts.appendChild(cardBody)
  }
  discussions(data)
  {
    let dcard = document.createElement('div');
    dcard.className = 'discussion-card';
    let dcardBody = document.createElement('div');
    dcardBody.className = 'dcard-body';
    let dname = document.createElement('div');
    dname.className = 'dname';
    if(data.user.fullname !== null)
    {
      var names = data.user.fullname.split(" ");
      var firstname = names[0];
      var lastname = names[1];
      var name = firstname.charAt(0) + lastname.charAt(0);
      dname.innerText = name;
    }
    else
    {
      dname.innerText = "NA";
    }
    dcardBody.appendChild(dname);
    let dtitle = document.createElement('div');
    dtitle.innerText = data.title;
    dtitle.className = 'dcard-title';
    dcardBody.appendChild(dtitle);
    let dtype = document.createElement('div');
    dtype.innerText = data.category.name;
    dtype.className = 'dtype';
    dcardBody.appendChild(dtype);
    let dvotes = document.createElement('div');
    dvotes.innerText = data.downvotes + data.upvotes + " Votes";
    dvotes.className = 'dvotes';
    dcardBody.appendChild(dvotes);
    let dviews = document.createElement('div');
    dviews.id = 'dviewcount';
    dviews.className = 'dviews';
    dviews.innerHTML = '<TrendingUpIcon></TrendingUpIcon> ' + data.viewcount + ' Views';
    dcardBody.appendChild(dviews);

    // let dtags = document.createElement('div');
    // dtags.className = 'dtags';
    // for(var i = 0; i<data.tags.length; i++)
    // {
    //   var dtag = document.createElement("div");
    //   // dtag.className = "tagbuttons";
    //   dtag.appendChild(document.createTextNode(data.tags[i].value));
    //   dtags.appendChild(dtag);
    // }
    // dcardBody.appendChild(dtags);
    dcard.appendChild(dcardBody);
    discussions.appendChild(dcard)
  }

  updiscussions(data)
  {
    let dcard = document.createElement('div');
    dcard.className = 'discussion-card';
    let dcardBody = document.createElement('div');
    dcardBody.className = 'dcard-body';
    let dname = document.createElement('div');
    dname.className = 'dname';
    if(data.user.displayname !== null)
    {
      // var names = data.user.fullname.split(" ");
      // var firstname = names[0];
      // var lastname = names[1];
      var name = data.user.displayname.charAt(0);
      dname.innerText = name;
    }
    else
    {
      dname.innerText = "NA";
    }
    dcardBody.appendChild(dname);
    let dtitle = document.createElement('div');
    dtitle.innerText = data.topic.title;
    dtitle.className = 'dcard-title';
    dcardBody.appendChild(dtitle);
    let dtype = document.createElement('div');
    dtype.innerText = data.category.name;
    dtype.className = 'dtype';
    dcardBody.appendChild(dtype);
    let dvotes = document.createElement('div');
    dvotes.innerText = data.downvotes + data.upvotes + " Votes";
    dvotes.className = 'dvotes';
    dcardBody.appendChild(dvotes);
    dcard.appendChild(dcardBody);
    discussions.appendChild(dcard)
  }

  course(data)
  {
    let coursecard = document.createElement('div');
    coursecard.className = 'course-card';
    let courseBody = document.createElement('div');
    courseBody.className = 'course-body';
    let courseheader = document.createElement('div');
    courseheader.className = 'courseheader';
    let courseicon = document.createElement('div');
    courseicon.className = 'courseicon';
    courseicon.innerHTML = "<img src="+data.appIcon+" width='322px', height='130px'>";
    let coursecreatericon = document.createElement('div');
    coursecreatericon.className = 'coursecreatericon';
    coursecreatericon.innerHTML="<img src="+data.creatorLogo+">";
    courseheader.appendChild(courseicon);
    courseheader.appendChild(coursecreatericon);
    courseBody.appendChild(courseheader)
    let co_body = document.createElement('div');
    co_body.className = 'co-body';
    let coursetitle = document.createElement('div');
    coursetitle.className = "course-title";
    coursetitle.innerText = data.name;
    co_body.appendChild(coursetitle);
    let co_creater = document.createElement('div');
    co_creater.className = "course-creator"
    if(data.creatorContacts)
    {
      co_creater.innerText = data.creatorContacts.split('"name":"')[1].slice(0, -3);
    }
    else
    {
      co_creater.innerText = "";
    }
   
    co_body.appendChild(co_creater);
    courseBody.appendChild(co_body);
    courses.appendChild(courseBody)
  }
  tags(value)
  {
    var a = document.createElement("button");
    a.id = value;
    a.className = "tagbuttons";
    a.appendChild(document.createTextNode(value));
    a.onclick = (e) => { this.setState({ message: value }); this.sendMessage(e) }
    buttonDiv.appendChild(a);
  }
  startArticle(value, cname) {
    if(cname === "msg-remote" && String(value).length > 100)
    {
      this.setState({showReponse : value})
      var actRespone = value;
      var less = document.createElement('span');
      less.id = "readless";
      less.className = "readMore";
      var tmpr = document.createTextNode('Read less ▲');
      var more = document.createElement('span');
      more.id = "readmore";
      more.className = "readMore";
      var tmp = document.createTextNode("Read more ▼");
      if(typeof(value)!== 'string')
      {
        // var heading = "There are " +value[0] + " items: \n";
        var heading = "The following are the active users: \n";
        value.shift();
        value = this.formatResponse(value)
        value = String(value).replaceAll(",",'')
        value = heading + "\n" + value;
        actRespone = value;
      }
      var shortRes = value.substr(0, 50);
      shortRes = shortRes + "...";
      this.setState({showReponse:shortRes});
      var b = document.getElementById("chatWindow");
      var a = document.createElement("article");
      a.className = "msg-container";
      a.classList.add(cname);
      a.id = "msg-0";
      var c = document.createElement("div");
      c.className = "msg-box";
      b.appendChild(a);
      a.appendChild(c);
      c.appendChild(document.createTextNode(this.state.showReponse));
      more.appendChild(tmp);
      c.appendChild(more);
      more.onclick = (e) => {this.setState({showReponse:actRespone});c.innerText= actRespone; less.appendChild(tmpr); c.appendChild(less); this.updateScroll()}
      less.onclick = (e) =>{this.setState({showReponse:shortRes}); c.innerText= shortRes; c.appendChild(more); this.updateScroll()}
    }
    else
    {
    var b = document.getElementById("chatWindow");
    var a = document.createElement("article");
    a.className = "msg-container";
    a.classList.add(cname);
    a.id = "msg-0";
    var c = document.createElement("div");
    c.className = "msg-box";
    b.appendChild(a);
    a.appendChild(c);
    c.appendChild(document.createTextNode(value));
    }
    
  }

  formatResponse(value)
  {
    for(var i = 0; i<value.length; i++)
    {
      value[i] = i+1 + ") " + value[i].value + "\n";
    }
    return value
  }

  formatResponseList(value)
  {
    for(var i = 0; i<value.length; i++)
    {
      value[i] = i+1 + ") " + value[i] + "\n";
    }
    return value
  }
  handleClick = event => {
    this.setState({
      [event.target.name]: event.target.value
    })

  }

  restCall(message) {
    var reply = '';
    this.state.data["sender"] = "Varsha";
    this.state.data["message"] = message;
    axios.post(process.env.REACT_APP_SANDBOX_URL, this.state.data).then(response => {
      if (response.data) {
        if (response.data[0]) {
          this.setState({ text: response.data[0]["custom"]["blocks"][0]["text"] }, () => { this.getResponse(); })
        }
        else {
          this.setState({ text: "Sorry couldn't respond properly. Try again after sometime" }, () => { this.getResponse(); })
        }
        this.setState({ text: "" })
        this.updateScroll()
      }

    })


  }

  getResponse() {
    var date = new Date;
    date.setTime(date.getTime);
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var time = hour + ":" + minutes
    this.startArticle(this.state.text, "msg-remote")
    this.updateScroll()
  }

  sendMessage(e) {
    e.preventDefault();
    if (this.state.message && this.state.message.length >= 5001) {
      e.preventDefault();
      alert("character limit exceeded");
      this.setState({ message: '' })
    }
    else {
      e.preventDefault();
      this.startArticle(this.state.message, "msg-self")
      this.updateScroll()
      if (this.state.domain === 'Sand') {
        this.restCall(this.state.message)
      }
      else {
        socket.emit('user_uttered', { "mail": "mahuli@varsha.com", "message": this.state.message, "endpoint": this.state.domain, "jwt": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxZGVvM2JTU28zU2pUZktSRmVnajkyR282QTQwWDY0cXB4dWdCZUVxekNnIn0.eyJqdGkiOiJjYzBlYjVkMy01YzM4LTRlNDQtYTVhNy0yNzAwYWVmM2RhOTAiLCJleHAiOjE2MzI0NjU0NDQsIm5iZiI6MCwiaWF0IjoxNjMyMzc5MDQ0LCJpc3MiOiJodHRwczovL2lnb3Qtc3RhZ2UuaW4vYXV0aC9yZWFsbXMvc3VuYmlyZCIsImF1ZCI6ImFkbWluLWNsaSIsInN1YiI6ImY6ODc3ZGQ1ODMtMzYyYi00YmU3LWEzMWYtOGNkMDI4OTZhZjg4OjdiYTIxOTUzLTZiZjktNDNlOS1iMjc4LTE5YjI2NDUyNjgyNSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFkbWluLWNsaSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6Ijc0NTk1M2Y2LTBiMjktNDdmYS1iNDdlLWRkZTM2YjkwYzQwZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6e30sIm5hbWUiOiJUZXN0ICBNb2JpbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3Rtb2JpbGV1c2VyXzcxZGMiLCJnaXZlbl9uYW1lIjoiVGVzdCAiLCJmYW1pbHlfbmFtZSI6Ik1vYmlsZSBVc2VyIiwiZW1haWwiOiJ0ZSoqKioqKioqKioqKipAeW9wbWFpbC5jb20ifQ.OKP_zwMf1_-B2aQI0UHIuT69jy288UDEJZIHUtoPNt6ZC0Ur95LfqMX4u6G7cSo8OXmhc7aIDF8_YpzR8GwkoXQ6RLN8Wfz2FP4KRQVfSg46nCXKxVIjE8mj71pdZD9w7Y2JBy2TNxtV-YtVmg1AUAvZ7Tc5-oxdABX0yd1M4909lP2z-2spnxqq1qzoj6GCuAIe_f8ewgokfVx5mX3tgkWlg7zFqJi-0z8rOJKj1X_iSEjSx9YIPk0agiGnZNmE-XnK1IPviY5R4ICFbYi9RNtKuMfwEDKDbF1bt_qwcpXDJqtAuXpzLzWUTr4muEmIG5uZ6jkbFa-ThUw4S0JYkg", 
        wid: "fb61adf6-cd48-40e9-81d9-1ff77bc09f91", uid: "586", username: "amritanischal_qh84"});
        setTimeout(() => { this.getResponse() }, 2000);
      }
      this.setState({ message: '' })
    }


  }
  myFunction() {
    var x = document.getElementById("chatbox");
    x.style.display = "block";
    document.getElementById("chatWindow").innerHTML = ""
  }

  myFunctionClose() {
    var x = document.getElementById("chatbox");
    x.style.display = "none";
  }

  updateScroll() {
    var element = document.getElementById("chatWindow");
    element.scrollTop = element.scrollHeight;
  }
  render() {

    return (
      <div className="chatbox-display">
        <section className="chatbox" id="chatbox">
          <div className="chat-header" >
            <div className="row">
              <div className="col-md-10">
                <p name="bots" id="bots" className="select">
                  <ChatIcon></ChatIcon>
                  Vega
                </p>
              </div>
              <div className="col-md-2 pull right">
                <CloseIcon style={{ cursor: "pointer", marginTop: "17px" }} onClick={this.myFunctionClose}></CloseIcon>
              </div>
            </div>

          </div>
          <section className="chat-window" id="chatWindow">
            <div></div>
          </section>
          <form className="chat-input" onsubmit="return false;">
            <input
              className="input"
              type="textarea"
              autocomplete="off"
              placeholder="Type a message"
              name="message"
              id="message"
              value={this.state.message}
              onChange={this.handleClick} />
            <button style={{ backgroundColor: "transparent", background: "transparent" }} onClick={(e) => this.sendMessage(e)} disabled={!this.state.message}>
              <SendIcon color='primary' onClick={this.updateScroll} />
            </button>
          </form>
        </section>
        <div>
          <img src="/img/image.png" alt="Avatar" onClick={this.myFunction} id="avatar">
          </img>
        </div>
      </div>
    );
  }
}

export default ChatWidget;