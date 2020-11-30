import React, { Component } from 'react';
import './Style.css';
import axios from 'axios';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Upload from './Upload';
import Summary from './Summary';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PublishIcon from '@material-ui/icons/Publish';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import jsxToString from 'jsx-to-string';
import { renderToString } from 'react-dom/server'
import SelectedText from './SelectText';
import * as API from './Api'


const styles = () => ({
  textField: {
    width: '95%',
    height: '60%',
    marginTop: "1%",
    paddingLeft: '1%',
    color: "black",
    // minHeight: '40%', 
    background: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderStyle: 'solid',

    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFFFFF',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#FFFFFF',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF',
    },
    '&& .MuiInput-root:hover::before': {
      borderColor: '#FFFFFF',
    },
    '& .MuiInputLabel-root': {
      marginTop: '15%',
      marginLeft: "35%"
    },
    '& .MuiInputLabel-shrink': {
      color: 'white',
    },
  },

  tooltip: {
    '.MuiTooltip-tooltip': {
      fontSize: 30,
      // width:'50%'
    }
  },

});

const theme = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: "$labelcolor"
        }
      }
    }
  }
})




var highlighted;

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      currentPage: 1,
      totalPages: 1,
      selectedFile: null,
      report: false,
      Summary: false,
      data: '',
      line_analysis: [],
      lines: [],
      firstLine: [],
      classification: '',
      probability: 0,
      possible_profanity: [],
      wordCount: [],
      pageWordCount: [],
      pages: [],
      text_tagged: '',
      color: '',
      offensive: [{ 'color': '#B00C0C', 'value': 'Above 80%' },  //color code
      { 'color': '#E61717', 'value': '50% to 80%' },
      { 'color': '#E66D17', 'value': 'Below 50%' },],
      not_offensive: [{ 'color': '#19AE48', 'value': 'Below 50%' },
      { 'color': '#008944', 'value': '50% to 80%' },
      { 'color': '#003B1D', 'value': 'Above 80%' },],
      select: false,
      selected_text: '',
      range: '',
      category: '',
      inDisable: false,

    }
  }

  resize = () => {
    console.log('resize')
    if (this.state.report) {
      var page = document.getElementById("highlight");
      page.style.height = 'unset';
      // if(page.scrollHeight>435){
      // page.style.overflow='scroll';
      // }else{
      //   page.style.overflow='unset';
      // }
    }
    //   if(this.state.report){
    //   this.setState({firstLine: this.pagination(this.state.lines)
    //   }, () => {
    //     this.setState({ wordCount: this.wordCounting(this.state.text_tagged, this.state.possible_profanity) })
    //     this.setState({ totalPages: this.state.firstLine.length });
    //     this.setState({ pages: this.wordPage() })
    //     this.lineColor(1); //report color code and highlighter
    //   })
    // }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  onHandleChange = event => {
    this.setState({ inputText: event.target.value }) //input value
  }


  onSubmit = event => {
    event.preventDefault();
    this.setState({ inDisable: true })
    if (this.state.inputText === '') {
      console.log('No text available for analysis')
      alert('Please upload the text file');
    }
    else {
      axios({                         //API Call
        method: 'post',
        url: API.Check_Profanity,
        headers: { 'Content-Type': 'application/json' },
        data: { text: this.state.inputText, } // This is the body part
      })
        .then(res => (res.data))
        .then((data) => {
          this.setState({ data: data });
          this.setState({ line_analysis: data.line_analysis })
          this.setState({ classification: data.overall_text_classification.classification })
          this.setState({ probability: (data.overall_text_classification.probability * 100).toFixed(2) })   //Rounding the probability %
          this.setState({ possible_profanity: data.possible_profanity, text_tagged: data.text_tagged })
          this.setState({ color: this.colorOvl(this.state.classification, this.state.probability) }); //overall profanity color
          this.setState({
            lines: this.state.text_tagged.split('.').filter(line => {
              return /\S/.test(line);
            })
          })  //extracting lines
          // var l = (this.state.lines.length - 1) ? this.state.line_analysis.length : 1;
          // var p = Math.floor(l / 15);
          this.setState({ report: true }, () => {
            this.setState({
              firstLine: this.pagination(this.state.lines)
            }, () => {
              this.setState({ wordCount: this.wordCounting(this.state.text_tagged, this.state.possible_profanity) })
              this.setState({ totalPages: this.state.firstLine.length });
              this.setState({ pages: this.wordPage() })
              this.lineColor(1); //report color code and highlighter
            })
          }); //report visible
          this.setState({ summary: true });
          // this.pages(this.state.lines);
          console.log(data)
        });
    }
  }


  colorOvl = (classification, probability) => {
    var color = '';
    if (classification === 'Offensive') {
      if (probability > 80) {
        color = this.state.offensive[0].color;
      } else if (probability >= 50) {
        color = this.state.offensive[1].color;
      } else {
        color = this.state.offensive[2].color;
      }
    } else {
      if (probability > 80) {
        color = this.state.not_offensive[2].color;
      } else if (probability >= 50) {
        color = this.state.not_offensive[1].color;
      } else {
        color = this.state.not_offensive[0].color;
      }
    }
    return color;
  }

  pagination = (lines) => {
    var arr, line, firstLine = [];
    firstLine = firstLine.concat(0);
    var page = document.getElementById("highlight");
    for (let k = 0; k < lines.length; k++) {
      arr = this.state.lines[k].split(/\[(.*?)\]\(possible profanity\)/);
      line = arr.reduce((prev, current) => {
        return prev.concat(current);
      }, [])
      if (page.scrollHeight <= page.offsetHeight) {
        page.innerHTML += line + ".";
      } else {
        k--;
        console.log(k)
        firstLine = firstLine.concat(k);
        page.innerHTML = '';
      }
    }
    page.innerHTML = '';
    page.style.height = 'unset';
    return firstLine;
  }

  pages = (lines) => {
    this.createPage();
    for (var i = 0; i < lines.length; i++) { // loops through all the lines

      var line = lines[i] + '.'
      var success = this.appendToLastPage(line); // tries to fill the line in the last page
      if (!success) { // checks if line could not be filled in last page
        this.createPage(); // create new empty page
        this.appendToLastPage(line); // fill the line in the new last element
      }
    }
  }

  createPage = () => {
    var page = document.createElement("span"); // creates new html element
    page.className += "page"; // appends the class "page" to the element
    document.getElementById("paginatedText").appendChild(page); // appends the element to the container for all the pages
  }

  appendToLastPage = (line) => {
    var page = document.getElementsByClassName("page")[document.getElementsByClassName("page").length - 1]; // gets the last page
    var pageText = page.innerHTML; // gets the text from the last page
    page.innerHTML += line; // saves the text of the last page
    if (page.offsetHeight < page.scrollHeight) { // checks if the page overflows (more words than space)
      page.innerHTML = pageText; //resets the page-text
      return false; // returns false because page is full
    } else {
      return true; // returns true because word was successfully filled in the page
    }
  }

  lineColor = (p) => {
    var lines, last, a;
    var b = 'none';
    var c = 'black';
    var wordCount = [];
    console.log(this.state.firstLine)
    // var line = document.createElement("span");
    // var text = document.createTextNode("This is new.");
    for (var i = 0; i < this.state.possible_profanity.length; i++) {
      wordCount = wordCount.concat(0);
    }

    if (this.state.firstLine.length === p) {
      last = this.state.lines.length;
    } else {
      last = this.state.firstLine[p];
    }

    if (this.state.lines.length - 1) {
      // let k=(p-1)*15
      // for (let k = (p - 1) * 15; k < l; k++) {
      // while(page.scrollHeight<=page.offsetHeight){
      for (let k = this.state.firstLine[p - 1]; k < last; k++) {
        c = this.colorCode(this.state.line_analysis[k].classification, this.state.line_analysis[k].probability * 100, 0) //color for lines
        b = this.colorCode(this.state.line_analysis[k].classification, this.state.line_analysis[k].probability * 100, 1)
        a = this.wordCounting(this.state.lines[k], this.state.possible_profanity);
        lines = <span>{lines}{this.highlight(this.state.lines[k] + '.', this.state.possible_profanity, c, b)}</span>; //highlighted report
        for (let j = 0; j < this.state.possible_profanity.length; j++) {
          wordCount[j] = wordCount[j] + a[j];
        }
        // highlighted= lines;
        // page.innerHTML= renderToString(lines)
        // page.innerHTML=("'"+ lines + "'")
        // console.log(page.innerHTML)
        // k++
      }
    } else { //one line report
      c = this.colorCode(this.state.classification, this.state.probability, 0) //color for line
      b = this.colorCode(this.state.classification, this.state.probability, 1)
      a = this.wordCounting(this.state.lines[0], this.state.possible_profanity);
      lines = <span>{lines}{this.highlight(this.state.lines[0], this.state.possible_profanity, c, b)}</span>; //highlighted report
      for (let j = 0; j < this.state.possible_profanity.length; j++) {
        wordCount[j] = wordCount[j] + a[j];
      }
    }
    this.setState({ pageWordCount: wordCount });
    // var text=jsxToString(<span><span><span><span><span><span><span><span><span><span>      i was all up for apple demanding 30%, it's their store, their ecosystem, their customers.</span></span><span>  and to be on of the world's biggest stores and get access to that audience, you got to pay something.</span></span><span>        so it's justified to have access to all of those tools, audience and get 30%but to make an app developer add features that will lead to income? now that is f*** up.</span></span><span>       that's abuse of power in my opinion.</span></span><span>  it's like building a hotel, renting a room and pak occupied kashmir then telling the tenant you're gonna do some <span style='text-decoration-line: underline; text-decoration-color: black;'>ho</span> action for me, bring me money!.</span></span><span>  i was all up for apple demanding 30%, it's their store, their ecosystem, their customers.</span></span><span>  and to be on of the world's biggest stores and get access to that audience, you got to pay something.</span></span><span style='background-color: rgb(255, 186, 186);'>        that's abuse of power in my opinion.</span></span><span style='background-color: rgb(255, 186, 186);'>  it's like building a hotel, renting a room and pak occupied kashmir then telling the tenant you're gonna do some <span style='background-color: rgb(255, 186, 186); text-decoration-line: underline; text-decoration-color: rgb(176, 12, 12);'>ho</span> action for me, bring me money! .</span></span>)
    // line.appendChild(text);
    // page.appendChild(line);
    // var text = jsxToString(lines)
    // text= text.replace('"',"'")
    // text= text.replace('"','\"')
    // page.innerHTML=  text.replace(/\s\s+/g, ' ');
    highlighted = lines;
    console.log(highlighted)
  }


  colorCode = (classification, probability, bg) => {     //color code
    var color = '';
    if (classification === 'Offensive') {
      console.log('off')
      if (probability > 80) {
        if (bg) {
          color = '#ffbaba'
        } else {
          color = this.state.offensive[0].color;
        }
      } else if (probability >= 50) {
        if (bg) {
          color = '#ff9e6e';
        } else {
          color = this.state.offensive[1].color;
        }
      } else {
        if (bg) {
          color = '#ffdba4';
        } else {
          color = this.state.offensive[2].color;
        }
      }
    } else {
      console.log('not-off')
      if (bg) {

        color = 'none';
      } else {
        color = 'black';
      }
    }
    console.log(color)
    return color;
  }


  highlight = (text, values, c, b) => { //Highlighter
    console.log('higlight')
    if (!values.length)
      return text;
    var arr = text.split(/\[(.*?)\]\(possible profanity\)/)    // split and remove text with []+(possible profanity)
    var line = (
      <span style={{ backgroundColor: b }}> {/*text color wrt color code*/}
        {arr.reduce((prev, current, i) => {
          if (!i)
            return [current];
          return prev.concat(   //add splited array into one line
            values.includes(current) ?
              //higligting profane words 
              <span key={i + current} style={{
                backgroundColor: b, textDecorationLine: 'underline',
                textDecorationColor: c
              }}>{current}</span>
              : current
          );
        }, [])}
      </span>);
    return line;
  }



  wordCounting = (text, words) => {
    var arr = text.split(/\[(.*?)\]\(possible profanity\)/);
    var wordCount = [];
    for (let i = 0; i < words.length; i++) {
      wordCount = wordCount.concat(0);
    }
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < words.length; j++) {
        if (arr[i] === words[j]) {
          wordCount[j]++;
          this.forceUpdate();
        }
      }
    }
    return wordCount;
  }

  wordPage = () => {
    var arr, words = this.state.possible_profanity;
    var pages = [];
    var page;
    for (let i = 0; i < words.length; i++) {
      pages = pages.concat([[]]);
    }
    function paging(k, firstLine) {
      for (let p = firstLine.length - 1; p >= 0; p--) {
        if (firstLine[p] <= k) {
          return p + 1;
        }
      }
    }
    for (let k = 0; k < this.state.lines.length; k++) {
      arr = this.state.lines[k].split(/\[(.*?)\]\(possible profanity\)/);
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < words.length; j++) {
          if (arr[i] === words[j]) {
            page = paging(k, this.state.firstLine);
            pages[j] = pages[j].concat(page)
          }
        }
      }
    }
    return pages;
  }


  prevPage = () => {
    console.log('prev 0f ' + this.state.currentPage + 'in' + this.state.totalPages);
    var p = this.state.currentPage - 1;
    this.setState({ currentPage: p });
    this.lineColor(p);
  }

  nextPage = () => {
    console.log('next 0f ' + this.state.currentPage + 'in' + this.state.totalPages);
    var p = this.state.currentPage + 1;
    this.setState({ currentPage: p });
    this.lineColor(p);
  }

  toPage = (p) => {
    this.setState({ currentPage: p });
    this.lineColor(p);
  }


  handleMouseUp = () => {
    var text = window.getSelection().toString();
    if (text.match(/^ *$/) == null) {
      console.log('Selected text:' + text);
      this.setState({ selected_text: text });
      this.setState({ select: true });
    }
  };

  changeSelect = (event) => {
    this.setState({ selected_text: event.target.value });
  }

  addTraining = (range, category) => {
    this.setState({ range: range, category: category })
    console.log(this.state.selected_text + ' ' + range + ' ' + category)
    axios.post(API.Add_Training, JSON.stringify({
      "text": this.state.selected_text,
      "category": category,
      "offensive": range
    }),
      { headers: { "Content-Type": "application/json" } })
      .then(res => (res.data))
      .then((data) => {
        if (data.status === 200) {
          alert('Training data added')
        } else {
          alert('error adding data')
        }
      })
    this.setState({ select: false })
  }

  closeTraining = () => {
    this.setState({ select: false })
  }




  render() {
    const { classes } = this.props;
    let summary1 = null;
    let text = null;
    let prevB = null;
    let nextB = null;


    if (this.state.currentPage === 1) {
      prevB = (
        <Button className="navigate-left" variant="outlined"
          style={{ width: '30px', height: '30px', background: "#FFFFFF", marginRight: '5%' }}
          disabled>
          <KeyboardArrowLeftIcon fontSize='large' />
        </Button>
      )
    } else {
      prevB = (
        <Button className="navigate-left" variant="outlined"
          style={{ width: '30px', height: '30px', background: "#FFFFFF", marginRight: '5%' }}
          onClick={this.prevPage}>
          <KeyboardArrowLeftIcon fontSize='large' />
        </Button>
      )
    }

    if (this.state.currentPage < this.state.totalPages) {
      nextB = (
        <Button className="navigate-right" variant="outlined"
          style={{ width: '30px', height: '30px', background: "#FFFFFF" }}
          onClick={this.nextPage}>
          <KeyboardArrowRightIcon fontSize='large' />
        </Button>
      )
    } else {
      nextB = (
        <Button className="navigate-right" variant="outlined"
          style={{ width: '30px', height: '30px', background: "#FFFFFF" }}
          disabled>
          <KeyboardArrowRightIcon fontSize='large' />
        </Button>
      )
    }

    if (this.state.report) {
      text = (
        <div>
          <div>
            <b className="space" style={{ float: 'left', marginTop: '-6%', marginLeft: '-5%' }}>
              Profanity Detector
                </b>
            <Button variant="contained" disabled style={{     //Submit button
              border: 'none', width: '18%', height: 40, textTransform: 'none',
              float: 'right', marginRight: '4%', marginTop: '-5%'
            }}
              type='submit'> Check Profanity </Button>
            <div style={{
              backgroundColor: "none", color: "#000000", width: '18%', height: 40,
              textTransform: 'none', float: 'right', marginRight: '20%', marginTop: '-5%'
            }}>
              <PublishIcon style={{ marginLeft: "0%", color: "black", marginRight: '2%', }} />
                  Upload File
                </div>
          </div>

          <div align='justify' style={{
            minHeight: 450, width: '96%', marginTop: "7%",
            background: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid',
          }} >
            <MuiThemeProvider theme={theme}>
              <Tooltip title={<span style={{ fontSize: '16px' }}>Select text for add to training data</span>}
                placement='top' arrow className={classes.tooltip}>
                <div style={{
                  whiteSpace: 'pre-wrap', marginTop: '1%', marginRight: '1%',
                  marginLeft: '1%', marginBottom: '1%', background: '#ffffff',
                  height: 435,
                  overflow: 'unset',
                }}
                  onMouseUp={this.handleMouseUp} id='highlight'>{highlighted}</div>
              </Tooltip>
            </MuiThemeProvider>
          </div>
          {/* <div id="paginatedText" style={{width:300, height:100, background:'white'}}></div> */}


          <div className="pages" style={{ float: 'right', marginRight: '7.5%' }}>
            {prevB}

            <span style={{
              marginLeft: '5%', marginRight: '5%', marginTop: '-5%', paddingLeft: '2%', paddingRight: '2%',
              display: 'inline-block', fontSize: '14px'
            }}>
              <pre>{this.state.currentPage} of {this.state.totalPages}</pre>
            </span>

            {nextB}
          </div>
        </div>
      );
    } else {
      text = (
        <form onSubmit={this.onSubmit}>
          <div>
            <b className="space" style={{ float: 'left', marginLeft: '-5%', }}>
              Profanity Detector
                </b>
            <Button variant="contained" color='primary' style={{
              border: 'none',    //Submit button
              width: '18%', height: 40, textTransform: 'none', float: 'right', marginRight: '4%', marginTop: '1%',
            }}
              type='submit'> Check Profanity </Button>
            <Upload />
          </div>

          <TextField id='text field'
            value={this.state.inputText}
            onChange={this.onHandleChange}     //Input field
            id="outlined-multiline-static"
            label="Enter or paste your text here"
            multiline={true}
            rows={22}
            fullWidth={true}
            required
            InputLabelProps={{ required: false, }}
            className={classes.textField}
            style={{ height: 450 }}
            disabled={this.state.inDisable} />

        </form>
      );
    }

    if (this.state.summary) {      //Display the report only after clicking the submit button
      if (this.state.select) {
        summary1 = (
          <SelectedText selected_text={this.state.selected_text}
            changeSelect={this.changeSelect} addTraining={this.addTraining}
            closeTraining={this.closeTraining} />
        );
      }
      else {
        summary1 = (
          <Summary data={this.state.data} color={this.state.color}
            pages={this.state.pages} wordCount={this.state.wordCount}
            pageWordCount={this.state.pageWordCount} toPage={this.toPage} />
        );

      }
    }
    else {

      summary1 = (
        //Empty Summary before submit
        <div>
          <div style={{
            color: 'black', align: "center", marginRight: '33%', marginTop: '-10%',
            display: 'inline-flex', float: 'right'
          }}>
            <CloudDownloadIcon style={{ color: "black", marginRight: '5%', }} />
                  Export_Summary
              </div>

          <div style={{
            backgroundColor: '#ffffff', height: 450, width: '90%',
            borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid',
          }}>
            <div style={{ textAlign: 'center', color: '#D0D0D0', marginTop: '55%' }}>
              Summary of the text
                  <br />
                  will appear here
                </div>
          </div>
        </div>
      );
    }



    return (
      <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '1%', }}>
        <div style={{ width: '75%', float: 'left' }}>
          {/* <div style={{marginLeft:'8%', marginRight:'4%', marginTop:'2%', }}> */}
          {text}
          {/* </div>               */}
        </div>

        <div style={{ width: '25%', float: 'left', }}>
          <div style={{ marginLeft: '10%', marginTop: '20%', }}>
            {summary1}
          </div>
        </div>
      </div>
    )
  }
}


export default withStyles(styles)(Report);
