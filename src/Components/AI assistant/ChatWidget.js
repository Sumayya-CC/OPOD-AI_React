import React, {Component } from 'react';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import io from 'socket.io-client';
import SendIcon from '@material-ui/icons/Send';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// import './bootstrap.min.css';

const socket = io(process.env.REACT_APP_VEGA_ROUTER_URL);
console.log(process.env.REACT_APP_VEGA_ROUTER_URL);
let reply = "Sorry! couldn't reply properly";
var buttonDiv = document.createElement('div');
buttonDiv.id = "buttonDiv";
let contacts = document.createElement('div')
contacts.className = 'contacts';
contacts.id = 'contact-list';
let discussions = document.createElement('div')
discussions.className = 'discussions';
discussions.id = 'discussion-list';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Sorry couldn't reply properly!", domain: 'sandbox', message: '', data: {}, activeBots: [], allBots: [], showReponse:'', showAvatar: true, buttons: {}
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
    console.log(process.env.REACT_APP_VEGA_ROUTER_URL)
    socket.on("bot_uttered", (data) => {
      if (data.text === '' || data.text === undefined) {
        reply = "Sorry couldn't reply properly!"
        this.setState({ text: reply })
      }
      else if (data.buttons === '' || data.buttons === undefined) {
        reply = data.type;

        if(data.type === 'contact')
        {
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          console.log(data.text[i])
          this.contact((data.text[i]))
        }
        b.appendChild(contacts);
        }
        else if(data.type === 'discussions')
        {
          var b = document.getElementById("chatWindow");
          for (var i = 0; i < data.text.length; i++) 
        {
          this.discussions((data.text[i]))
        }
        b.appendChild(discussions);
        }
        else if(data.type === 'direct')
        {
          reply = data.text;
          this.setState({ text: reply })
          // this.startArticle(this .state.text, 'msg-remote');
        }
        // this.setState({ text: reply })
      }
      else {
        console.log(data)
        reply = data.text;
        this.setState({ text: reply })
        var b = document.getElementById("chatWindow");
        for (var i = 0; i < data.buttons.length; i++) 
        {
          this.tags((data.buttons[i].title))
        }
        b.appendChild(buttonDiv);
      }
    });
    this.setState({ text: "Sorry! couldn't reply properly" })
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
    if(data[0].personalDetails.firstname !== null || data[0].personalDetails.firstname !== "")
    {
      fn = data[0].personalDetails.firstname.charAt(0);
    }
    if(data[0].personalDetails.surname !== null || data[0].personalDetails.surname !== "" )
    {
      ln = data[0].personalDetails.surname.charAt(0);
    }
    cname.innerText = fn + ln;
    cheader.appendChild(cname);
    cardBody.appendChild(cheader)
    let cbody = document.createElement('div');
    cbody.className = 'cbody';
    let ctitle = document.createElement('div');
    ctitle.innerText = data[0].personalDetails.firstname + " " + data[0].personalDetails.surname;
    cbody.appendChild(ctitle);
    let cdept = document.createElement('div');
    cdept.innerText = data[0].employmentDetails.departmentName
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
    if(cname === "msg-remote" && String(value).length > 50)
    {
      console.log(value)
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
        var heading = "The following are the items: \n";
        value.shift();
        value = this.formatResponse(value)
        console.log(value);
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
      
      console.log(value[i]);
   
      value[i] = i+1 + ") " + value[i] + "\n";
    }
    console.log(value)
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
      console.log(response)
      console.log(response.data !== '')
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
      console.log(this.state.message)
      e.preventDefault();
      this.startArticle(this.state.message, "msg-self")
      this.updateScroll()
      console.log(this.state.domain)
      if (this.state.domain === 'Sand') {
        console.log(this.state.domain)
        this.restCall(this.state.message)
      }
      else {
        console.log("enter there the code")
        socket.emit('user_uttered', { "mail": "mahuli@varsha.com", "message": this.state.message, "endpoint": this.state.domain, "jwt": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxZGVvM2JTU28zU2pUZktSRmVnajkyR282QTQwWDY0cXB4dWdCZUVxekNnIn0.eyJqdGkiOiJhNDA3ZWViYi1lOTJkLTRmODgtYTc4NC05YWRhNTRjYWUwYzIiLCJleHAiOjE2MjY5MzA1NjUsIm5iZiI6MCwiaWF0IjoxNjI2ODQ0MTY1LCJpc3MiOiJodHRwczovL2lnb3Qtc3RhZ2UuaW4vYXV0aC9yZWFsbXMvc3VuYmlyZCIsImF1ZCI6InBvcnRhbCIsInN1YiI6ImY6ODc3ZGQ1ODMtMzYyYi00YmU3LWEzMWYtOGNkMDI4OTZhZjg4OjdiYTIxOTUzLTZiZjktNDNlOS1iMjc4LTE5YjI2NDUyNjgyNSIsInR5cCI6IkJlYXJlciIsImF6cCI6InBvcnRhbCIsIm5vbmNlIjoiY2ZlMTNjYTgtNjM2OS00YzBjLThiZGMtNzFhMTU4ZjU1NDRmIiwiYXV0aF90aW1lIjoxNjI2ODQzNjY3LCJzZXNzaW9uX3N0YXRlIjoiNjFhYTMxZDAtNGUwMi00YjYzLThmNzItZDUwNjg3NTcwNmZiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJUZXN0ICBNb2JpbGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3Rtb2JpbGV1c2VyXzcxZGMiLCJnaXZlbl9uYW1lIjoiVGVzdCAiLCJmYW1pbHlfbmFtZSI6Ik1vYmlsZSBVc2VyIiwiZW1haWwiOiJ0ZSoqKioqKioqKioqKipAeW9wbWFpbC5jb20ifQ.iwBkYwX-dLj-oby1bPvaR-7dOtg_2AIPmQinZ1SBdXdYPLgIk_SGxFJdD0LLVErrg867RMuVUiuYFjnzZaf1xpB5FOWSRqXDHllwVWIJhjloR7jp0nNe-P5QY5cRMzyXsgJnGPqSWosFowYxb1REBbWUjsbduFuriBMhVI18H2E4_K2XUw_w_FWyWlfiYGVA4YkeuxlKVb10Srh0_30rw5xn0YR047jfaTahqWSCopBCa-CIi_maRwSxlUzxYjqfwhzXSkbvuKx4ll19Cfv6uQ7_XsgnDffgAEJ2zE9KBR0K9wBSkFryShJ4Z63p5WId076ZI7nBZ9_JPyf4MWV8BQ"});
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

        <div>
        <Typography component="div">
          <Box fontWeight="fontWeightBold" mt={5} ml={10} className="heading-1">
            AI assistant
          </Box>
        </Typography>
        <Grid container justify="flex-end" alignItems="flex-end" style={{right: "2rem", bottom: "5rem" , marginTop: '100px'}}>
        <div style={{marginRight: "20px" }}>
        <section className="chatbox" id="chatbox">
          <div className="chat-header" >
              <Grid container spacing={0}>
                <Grid>
                <p name="bots" id="bots" className="select">
                <ChatIcon></ChatIcon>
                </p>     
                </Grid>
                <Grid>
                <p name="bots" id="bots" className="vega">
                Vega
                </p>     
                </Grid>
            </Grid>

          </div>
          <section className="chat-window" id="chatWindow">
            <div></div>
          </section>
          <form className="chat-input" onsubmit="return false;">
            <input
              className="input"
              type="textarea"
              autoComplete="off"
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
          <img src="/img/image.png" alt="Avatar" id="avatar" style={{marginLeft : "280px"}}>
          </img>
        </div>
      </div>
         
        </Grid>
      </div>
    );
  }
}

export default ChatWidget;