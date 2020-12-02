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
import SelectedText from './SelectText';
import * as API from './Api'


const styles = () => ({
  textField: {
    width: '95%',
    height: '60%',
    marginTop: "1%",
    paddingLeft: '1%',
    color: "black",
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
      selectedFile: null,
      report: false,
      disable: false,
      Summary: false,
      data: '',
      line_analysis: [],
      lines: [],
      firstLine: [],
      classification: '',
      probability: 0,
      possible_profanity: [],
      text_tagged: '',
      classColor: '',
      currentPage: 1,
      totalPages: 1,
      wordCount: [],
      pageWordCount: [],
      pages: [],
      offensive: [{ 'color': '#B00C0C', 'value': 'Above 80%' },         //color code
      { 'color': '#E61717', 'value': '50% to 80%' },
      { 'color': '#E66D17', 'value': 'Below 50%' },],
      not_offensive: [{ 'color': '#19AE48', 'value': 'Below 50%' },
      { 'color': '#008944', 'value': '50% to 80%' },
      { 'color': '#003B1D', 'value': 'Above 80%' },],
      select: false,
      selected_text: '',
      offRange: '',
      category: '',

    }
  }

  // resize = () => {                                                      //function on resize
  //   console.log('resize')
  //   if (this.state.report) {
  //     var page = document.getElementById("highlight");
  //     page.style.height = 'unset';
  //     // if(page.scrollHeight>435){
  //     // page.style.overflow='scroll';
  //     // }else{
  //     //   page.style.overflow='unset';
  //     // }
  //   }
  //   //   if(this.state.report){
  //   //   this.setState({firstLine: this.pagination(this.state.lines)
  //   //   }, () => {
  //   //     this.setState({ wordCount: this.wordCounting(this.state.text_tagged, this.state.possible_profanity) })
  //   //     this.setState({ totalPages: this.state.firstLine.length });
  //   //     this.setState({ pages: this.wordPage() })
  //   //     this.lineColor(1); //report color code and highlighter
  //   //   })
  //   // }
  // }

  // componentDidMount() {                                                 //check window resize
  //   window.addEventListener('resize', this.resize)
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.resize)
  // }

  onHandleChange = event => {
    this.setState({ inputText: event.target.value })                    //input text value
  }


  onSubmit = event => {                                                 //check profanity
    event.preventDefault();
    this.setState({ disable: true })                                    //disabling button
    if (this.state.inputText === '') {                                  //empty uploaded file
      console.log('No text available for analysis')
      alert('Please upload the text file');
    }
    else {
      axios({                                                           //check profanity API Call
        method: 'post',
        url: API.Check_Profanity,
        headers: { 'Content-Type': 'application/json' },
        data: { text: this.state.inputText, }                           // This is the body part
      })
        .then(res => (res.data))
        .then((data) => {
          this.setState({ data: data });                                //for passing to Summary.js
          this.setState({ line_analysis: data.line_analysis })
          this.setState({ classification: data.overall_text_classification.classification })
          this.setState({ probability: (data.overall_text_classification.probability * 100).toFixed(2) })   //Rounding the probability %
          this.setState({ possible_profanity: data.possible_profanity, text_tagged: data.text_tagged })
          this.setState({ classColor: this.colorOvl(this.state.classification, this.state.probability) });  //overall classification color
          this.setState({
            lines: this.state.text_tagged.split('.').filter(line => {   //converting text tagged into array of lines
              return /\S/.test(line);                                   //removing empty or whitespace lines from the array
            })
          })
          this.setState({ report: true }, () => {                       //display report 
            this.setState({
              firstLine: this.pagination(this.state.lines)              //dynamic pagination
            }, () => {
              this.setState({ wordCount: this.wordCounting(this.state.text_tagged, this.state.possible_profanity) })//total profane word count
              this.setState({ totalPages: this.state.firstLine.length });//no. of total pages
              this.setState({ pages: this.wordPage() })                  //page no.s of profane words
              this.lineColor(1);                                         //report color coding and highlighting
            })
          });
          this.setState({ summary: true });                              //display summary
          console.log(data)
        });
    }
  }


  colorOvl = (classification, probability) => {       //overall profanity classification color coding
    var color = '';
    if (classification === 'Offensive') {             //offensive 
      if (probability > 80) {
        color = this.state.offensive[0].color;
      } else if (probability >= 50) {
        color = this.state.offensive[1].color;
      } else {
        color = this.state.offensive[2].color;
      }
    } else {                                          //not offensive
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


  pagination = (lines) => {                             //dynamic pagination
    var arr, line, firstLine = [];
    firstLine = firstLine.concat(0);                    //first page first line index (0)
    var page = document.getElementById("highlight");    //highlighted text displaying element
    for (let k = 0; k < lines.length; k++) {            //removing profane word tagging from each line
      arr = this.state.lines[k].split(/\[(.*?)\]\(possible profanity\)/);
      line = arr.reduce((prev, current) => {            //splitted array into single line
        return prev.concat(current);
      }, [])
      if (page.scrollHeight <= page.offsetHeight) {     //checking max line capacity of page
        page.innerHTML += line + ".";                   //add next line into the page
      } else {                                          //if max capacity reach, then next page
        k--;
        firstLine = firstLine.concat(k);                //first line of next page
        page.innerHTML = '';                            //clear for next page checking
      }
    }
    page.innerHTML = '';                                //clearing page
    page.style.height = 'unset';                        //after pagination removing page height
    return firstLine;
  }


  lineColor = (p) => {
    var lines, last, a;
    var b = 'none';                                     //highlight color
    var u = 'black';                                    //underline color
    var wordCount = [];
    console.log(this.state.firstLine)
    for (var i = 0; i < this.state.possible_profanity.length; i++) {
      wordCount = wordCount.concat(0);                  //initializing profane word count array
    }

    if (this.state.firstLine.length === p) {            //checking for last page
      last = this.state.lines.length;                   //last line of text (index+1)
    } else {
      last = this.state.firstLine[p];                   //first line of next page
    }

    if (this.state.lines.length - 1) {                                    //multiline report
      for (let k = this.state.firstLine[p - 1]; k < last; k++) {
        u = this.colorCode(this.state.line_analysis[k].classification,
          this.state.line_analysis[k].probability * 100, 0)               //color for underlines
        b = this.colorCode(this.state.line_analysis[k].classification,
          this.state.line_analysis[k].probability * 100, 1)               //background color
        a = this.wordCounting(this.state.lines[k], this.state.possible_profanity);//wordcount for line
        lines = <span>{lines}{this.highlight(this.state.lines[k] + '.',
          this.state.possible_profanity, u, b)}</span>;                   //highlighted report, combining lines
        for (let j = 0; j < this.state.possible_profanity.length; j++) {
          wordCount[j] = wordCount[j] + a[j];                             //adding word counts
        }
      }
    } else {                                                               //one line report
      u = this.colorCode(this.state.classification, this.state.probability, 0)
      b = this.colorCode(this.state.classification, this.state.probability, 1)
      a = this.wordCounting(this.state.lines[0], this.state.possible_profanity);
      lines = <span>{lines}{this.highlight(this.state.lines[0], this.state.possible_profanity, u, b)}</span>;
      for (let j = 0; j < this.state.possible_profanity.length; j++) {
        wordCount[j] = wordCount[j] + a[j];                                 //word count for one line text
      }
    }
    this.setState({ pageWordCount: wordCount });
    highlighted = lines;
  }


  colorCode = (classification, probability, bg) => {    //color code for lines
    var color = '';
    if (classification === 'Offensive') {               //offensive
      if (probability > 80) {
        if (bg) {                                       //background color
          color = '#ffbaba'
        } else {
          color = this.state.offensive[0].color;        //underline color
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
    } else {                                            //not offensive
      if (bg) {
        color = 'none';                                 //no background color
      } else {
        color = 'black';                                //black underline
      }
    }
    return color;
  }


  highlight = (text, values, c, b) => {                 //Highlighter
    if (!values.length)
      return text;
    var arr = text.split(/\[(.*?)\]\(possible profanity\)/)    // split into array by removing []+(possible profanity)
    var line = (
      <span style={{ backgroundColor: b }}>{/*highligt color wrt color code*/}
        {arr.reduce((prev, current, i) => {
          if (!i)
            return [current];
          return prev.concat(                           //combining splited array into one line
            values.includes(current) ?                  //underlining profane words  
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



  wordCounting = (text, words) => {                           //profane word count
    var arr = text.split(/\[(.*?)\]\(possible profanity\)/);  //seperate profane words and other text
    var wordCount = [];
    for (let i = 0; i < words.length; i++) {
      wordCount = wordCount.concat(0);                        //initializing count array
    }
    for (let i = 0; i < arr.length; i++) {                    //in each text part
      for (let j = 0; j < words.length; j++) {                //checking each profane word
        if (arr[i] === words[j]) {
          wordCount[j]++;
        }
      }
    }
    return wordCount;
  }

  wordPage = () => {                                          //page no.s of profane words
    var arr, words = this.state.possible_profanity;
    var pages = [];
    var page;
    for (let i = 0; i < words.length; i++) {
      pages = pages.concat([[]]);                             //array of array of page no. of each profane words
    }
    function paging(k, firstLine) {                                      //finding page no. of a line
      for (let p = firstLine.length - 1; p >= 0; p--) {       //last to first page
        if (firstLine[p] <= k) {
          return p + 1;
        }
      }
    }
    for (let k = 0; k < this.state.lines.length; k++) {       //each line
      arr = this.state.lines[k].split(/\[(.*?)\]\(possible profanity\)/); //seperate profane words
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < words.length; j++) {
          if (arr[i] === words[j]) {                          //checking seperated text with profane words
            page = paging(k, this.state.firstLine);                                 //finding page no. of line
            pages[j] = pages[j].concat(page)                  //add page no. into page no. of that word
          }
        }
      }
    }
    return pages;
  }


  prevPage = () => {
    var p = this.state.currentPage - 1;               //previous page no.
    this.setState({ currentPage: p });
    this.lineColor(p);                                //getting highligted previous page
  }

  nextPage = () => {
    var p = this.state.currentPage + 1;               //next page no.
    this.setState({ currentPage: p });
    this.lineColor(p);                                //getting highligted next page
  }

  toPage = (p) => {
    this.setState({ currentPage: p });
    this.lineColor(p);                                //getting highligted page of seleted page no.
  }


  handleMouseUp = () => {
    var text = window.getSelection().toString();      //get selected text
    if (text.match(/^ *$/) == null) {                 //remove empty and whitespace selection
      this.setState({ selected_text: text });
      this.setState({ select: true });                //display SelectText
    }
  };

  changeSelect = (event) => {                         //handling selected text
    this.setState({ selected_text: event.target.value });
  }

  addTraining = (offRange, category) => {             //add training data into the database
    this.setState({ offRange: offRange, category: category })
    axios.post(API.Add_Training, JSON.stringify({     //add training data mock API call
      "text": this.state.selected_text,
      "category": category,
      "offensive": offRange
    }),
      {
        headers: { "Content-Type": "application/json" }
      })
    axios.post(API.Save_TrainingData, JSON.stringify([{     //add training data API call
      "text": this.state.selected_text,
      "category": category,
      "offensive": offRange
    }]),
      { headers: { "Content-Type": "application/json" } })
      .then(res => (res.data))
      .then((data) => {
        if (data.message === 'success') {
          alert('Training data added')
        } else {
          alert('error adding data')
        }
      })
    axios.post(API.Reload_TrainingData, JSON.stringify({//reload training data
      "custom_profanity": true,
      "model": false
    }),
      {
        headers: { "Content-Type": "application/json" }
      })
    this.setState({ select: false })                  //hide SelectText 
  }

  closeTraining = () => {                             //close SelectText 
    this.setState({ select: false })                  //hide SelectText 
  }




  render() {
    const { classes } = this.props;                   // with styles classes
    let summary1 = null;                              //summary or selected text
    let text = null;                                  //input text field or highligted page
    let prevB = null;                                 //previous button
    let nextB = null;                                 //next button

    if (this.state.currentPage === 1) {               //first page
      prevB = (                                       //disable previous button
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
    } else {                                          //last page
      nextB = (                                       //disable next button
        <Button className="navigate-right" variant="outlined"
          style={{ width: '30px', height: '30px', background: "#FFFFFF" }}
          disabled>
          <KeyboardArrowRightIcon fontSize='large' />
        </Button>
      )
    }

    if (this.state.report) {          //after check profanity submission
      text = (                        //Highlighted page
        <div>
          <div>
            <b className="space" style={{ float: 'left', marginTop: '-6%', marginLeft: '-5%' }}>
              Profanity Detector
                </b>
            <Button variant="contained" disabled style={{     //disabled button
              border: 'none', width: '18%', height: 40, textTransform: 'none',
              float: 'right', marginRight: '4%', marginTop: '-5%'
            }}
              type='submit'> Check Profanity </Button>
            <div style={{
              backgroundColor: "none", color: "#000000", width: '18%', height: 40,
              textTransform: 'none', float: 'right', marginRight: '20%', marginTop: '-5%'
            }}>
              <PublishIcon style={{ marginLeft: "0%", color: "black", marginRight: '2%', }} />{/*disabled upload*/}
                  Upload File
                </div>
          </div>

          <div align='justify' style={{
            minHeight: 450, width: '96%', marginTop: "7%",
            background: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid',
          }} >
            <MuiThemeProvider theme={theme}>          {/*Tooltip for page*/}
              <Tooltip title={
                <span style={{ fontSize: '16px' }}>
                  Select text for add to training data
                </span>}
                placement='top' arrow className={classes.tooltip}>
                <div style={{
                  whiteSpace: 'pre-wrap', marginTop: '1%', marginRight: '1%',
                  marginLeft: '1%', marginBottom: '1%', background: '#ffffff',
                  height: 435,
                  overflow: 'unset',
                }}
                  onMouseUp={this.handleMouseUp} id='highlight'>{highlighted}</div>{/*highlighted page*/}
              </Tooltip>
            </MuiThemeProvider>
          </div>

          {/*paging*/}
          <div className="pages" style={{ float: 'right', marginRight: '7.5%' }}>
            {prevB}

            <span style={{
              marginLeft: '5%', marginRight: '5%', marginTop: '-5%', paddingLeft: '2%',
              paddingRight: '2%', display: 'inline-block', fontSize: '14px'
            }}>
              <pre>{this.state.currentPage} of {this.state.totalPages}</pre>
            </span>

            {nextB}
          </div>
        </div>
      );
    } else {                         //Before check profanity
      text = (                       //input field for check profanity
        <form onSubmit={this.onSubmit}>
          <div>
            <b className="space" style={{ float: 'left', marginLeft: '-5%', }}>
              Profanity Detector
                </b>
            <Button variant="contained" color='primary' style={{
              border: 'none',    //Submit button
              width: '18%', height: 40, textTransform: 'none', float: 'right',
              marginRight: '4%', marginTop: '1%',
            }}
              type='submit'> Check Profanity </Button>  {/*Check profanity submit button*/}
            <Upload />            {/*upload file*/}
          </div>

          <TextField id='text field'      //inut text field
            value={this.state.inputText}
            onChange={this.onHandleChange}
            label="Enter or paste your text here"
            multiline={true}
            rows={22}
            fullWidth={true}
            required
            InputLabelProps={{ required: false, }}
            className={classes.textField}
            style={{ height: 450 }}
            disabled={this.state.disable} />  {/*disabling after submitting*/}
        </form>
      );
    }

    if (this.state.summary) {      //Display the summary after getting the profanity data
      if (this.state.select) {     //display selected text
        summary1 = (
          <SelectedText selected_text={this.state.selected_text}
            changeSelect={this.changeSelect} addTraining={this.addTraining}
            closeTraining={this.closeTraining} />
        );
      }
      else {                      //display profanity summary
        summary1 = (
          <Summary data={this.state.data} color={this.state.classColor}
            pages={this.state.pages} wordCount={this.state.wordCount}
            pageWordCount={this.state.pageWordCount} toPage={this.toPage} />
        );

      }
    }
    else {
      summary1 = (                //Empty Summary before submit
        <div>
          <div style={{
            color: 'black', align: "center", marginRight: '33%', marginTop: '-10%',
            display: 'inline-flex', float: 'right'
          }}>
            <CloudDownloadIcon style={{ color: "black", marginRight: '5%', }} />  {/*disabled download*/}
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
        <div style={{ width: '75%', float: 'left' }}>               {/*input text field or highligted page*/}
          {text}
        </div>

        <div style={{ width: '25%', float: 'left', }}>
          <div style={{ marginLeft: '10%', marginTop: '20%', }}>    {/*summary or selected text*/}
            {summary1}
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Report);