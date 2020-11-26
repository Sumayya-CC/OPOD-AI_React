import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { exportComponentAsJPEG } from "react-component-export-image";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import './Style.css';

const styles = (theme) => ({
  list: {
    borderStyle: 'hidden',
    '&:hover': {
      borderStyle: 'solid',
      borderWidth: '1px'
    }
  },
  expanded: {
    // width: '100%',
    border: 'none',
    // '&$expanded': {
    //     height:'5px'
    //  }
  },
})

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
    this.exp = React.createRef();       //reference to download summary
  }

  handleChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };


  render() {
    const { classes } = this.props;

    return (
      <div>
        <div style={{
          color: 'black', align: "center", marginTop: '-10%', marginRight: '33%',
          display: 'inline-flex', float: 'right'
        }}
          onClick={() => exportComponentAsJPEG(this.exp)}>                                            {/*download summary*/}
          <CloudDownloadIcon color='primary' style={{ marginLeft: "0%", marginRight: '5%' }} />
                Export_Summary
          </div>

        <div style={{
          marginTop: '22%', backgroundColor: '#ffffff', minHeight: 450, width: '90%',
          borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid', marginRight: '30%', overflow: 'unset'
        }} ref={this.exp}>                                                                            {/*this will be downloaded*/}
          <div style={{ marginLeft: '4%', marginTop: '3%', fontFamily: "roboto", fontSize: 15, }}>

            <b>Overall Profanity : </b>
            <span style={{ color: this.props.color }}>                                                {/*classsification with color code*/}
              {this.props.data.overall_text_classification.classification} :
              {(this.props.data.overall_text_classification.probability * 100).toFixed(2)}%
              </span>
            <br />
            <b>Profane Word Count : {this.props.data.possible_profane_word_count}</b>
            <br /><br />

                Offensive| Occurances
              <List style={{ marginLeft: '2%', width: '90%', }}>
              {this.props.data.possible_profanity.map((listData, i) => (                              //Mapping all the profane words
                <Accordion expanded={this.state.expanded === 'panel' + i}
                  onChange={this.handleChange('panel' + i)} square={true} elevation={0} style={{ border: 'none', }}>
                  <AccordionSummary className={classes.expanded}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header" style={{ backgroundColor: '#F2F2F2', marginBottom: '2%' }}>
                    <ListItemText key={i} style={{ backgroundColor: '#F2F2F2', paddingLeft: '2%' }}>
                      {listData} ({this.props.wordCount[i]})                                          {/*displaying profane words with count*/}
                    <FiberManualRecordIcon fontSize='small' style={{ float: 'right', color: "#EC0000", }} />
                    </ListItemText>
                  </AccordionSummary>
                  {this.props.pages[i].map((page, j) => (                                             //mapping all the profane words pages
                    <AccordionDetails onClick={() => this.props.toPage(page)}>                        {/*on expansion displaying page no.*/}
                      <Tooltip title={"Go to page " + page} arrow>                                    {/*on click - go to that age*/}
                        <button key={i + ' ' + j} id={i + ' ' + j} className={classes.list}
                          style={{
                            backgroundColor: '#E2E2E2', paddingLeft: '1%', width: '120%', textAlign: 'start',
                            marginLeft: '-8%', marginTop: '-4%', marginRight: '-8%', marginBottom: '-7%',
                          }}>
                          <span style={{ marginLeft: '8%' }}> Page {page}</span>
                        </button>
                      </Tooltip>
                    </AccordionDetails>))}
                </Accordion>))}
            </List>
            <br />

            <b>On this page: </b>
            <br />
                Offensive| Occurances
              <br />
            {/* No Occurance */}
            <List style={{ marginLeft: '2%', width: '90%', }}>
              {this.props.data.possible_profanity.map((listData, i) => (                       //mapping all the profane words on this page
                <ListItemText key={i} style={{ backgroundColor: '#F2F2F2', paddingLeft: '5%', paddingRight: '5%' }}>
                  {listData} ({this.props.pageWordCount[i]})
                  <FiberManualRecordIcon fontSize='small' style={{ float: 'right', color: '#EC0000', }} />
                </ListItemText>))}
            </List>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Summary);