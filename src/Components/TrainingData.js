import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import './Style.css';
import axios from 'axios';
import * as API from './Api'

const useStyles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: "#F7F8F8",
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%',
        color: 'white',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        color: "black",
        background: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#0074B6',
        borderStyle: 'solid',
        '& label.Mui-focused': {
            color: '#0074B6',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'white',
        },

        '&.Mui-focused fieldset': {
            borderColor: '#FFFFFF',
        },
        '&& .MuiInput-root:hover::before': {
            borderColor: '#FFFFFF',
        },
        '& .MuiInputLabel-root': {
            color: '#0074B6',
            marginLeft: '1%',
            marginTop: '-1%'
        },
        '& .MuiInputLabel-shrink': {
            color: '#0074B6',
        },
    },
});


var b = ['#E0E0E0', '#F7F8F8', '#F7F8F8'];      //offensive range colors
var edit=[[],[],[]];                        //store 'edit' selected positions

class TrainingData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: ['Unparliamentary Words', 'Culturally Sensitive', 'Politically Sensitive',],
            wordCount: [0, 0, 0],
            words: [[],[],[]],
            offClassification: [[],[],[]],
            Offensive: '',
            word: '',
            index: 0,
            editWords: [],
            editOffensive: [],
            reload: 0,
            data: {},
            id: [[],[],[]]
        }
    }
    componentWillUpdate() {
        this.getData(1)
    }

    componentDidMount() {           //initial function
        this.getData(0);

        // this.setState({
        //     words: [['bribe', 'double-talk', 'racist', 'blackmail', 'blind',],
        //     ['fuck', 'asshole', 'bitch', 'mofo', 'ho', 'bastard',],
        //     ['dfs', 'ahd', 'kgf']],
        //     offClassification: [['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Lightly Offensive', 'Offensive',],
        //     ['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Offensive', 'Offensive', 'Lightly Offensive',],
        //     ['Offensive', 'Lightly Offensive', 'Extremely Offensive',]],
        //    });
        // edit = [[false, false, false, false, false,],
        // [false, false, false, false, false, false,],
        // [false, false, false]];
        // this.setState({
        //     editWords: [['bribe', 'double-talk', 'racist', 'blackmail', 'blind',],
        //     ['fuck', 'asshole', 'bitch', 'mofo', 'ho', 'bastard',],
        //     ['dfs', 'ahd', 'kgf']],
        //     editOffensive: [['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Lightly Offensive', 'Offensive',],
        //     ['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Offensive', 'Offensive', 'Lightly Offensive',],
        //     ['Offensive', 'Lightly Offensive', 'Extremely Offensive',]]
        // });
        // for(var i=0;i<this.state.words.length;i++){
        //     edit=edit.concat([[]]);
        //     for(var j=0; j<this.state.words[i].length;j++){
        //         edit[i]=edit[i].concat(false)
        //         this.forceUpdate();
        //     }
        // }
    }

    getData = (a) => {
        axios.get(API.Add_Training)                                   //get all training data to display
            .then(response => {
                this.setState({ data: response.data }, () => {        //function call immediate to state setting
                    this.dataSet(this.state.data.payload, a)
                });
            });
    }

    dataSet = (data, a) => {
        console.log(data)
        console.log(data.length)
        var words = [[], [], []], offClassification = [[], [], []], id = [[], [], []], wordCount = [];
        for (var i = 0; i < data.length; i++) {                                         //recurring through every training data
            if (data[i].category === 'Unparliamentary Words') {                         //1st category
                words[0] = words[0].concat(data[i].text)
                offClassification[0] = offClassification[0].concat(data[i].offensive)
                id[0] = id[0].concat(data[i].id)
            } else if (data[i].category === 'Culturally Sensitive') {                   //2nd category
                words[1] = words[1].concat(data[i].text)
                offClassification[1] = offClassification[1].concat(data[i].offensive)
                id[1] = id[1].concat(data[i].id)
            } else if (data[i].category === 'Politically Sensitive') {                  //3rd category                                     
                words[2] = words[2].concat(data[i].text)
                offClassification[2] = offClassification[2].concat(data[i].offensive)
                id[2] = id[2].concat(data[i].id)
            } else {
                console.log('invalid category', data[i])
            }
        }
        for (var c = 0; c < 3; c++) {
            wordCount = wordCount.concat(words[c].length)    //data count in each categories
        }
        if (!a) {                                            //initial setup, all edit selection false, edit data = training data
            edit = [[], [], []];
            this.setState({editWords: words, editOffensive: offClassification})
            for (var k = 0; k < 3; k++) {
                for (var j = 0; j < words[k].length; j++) {
                    edit[k] = edit[k].concat(false)
                }
            }
        }else{
            for (let index = 0; index < 3; index++) {       //updating non edit data
                for (let inx = 0; inx < words[index].length; inx++) {
                    if(!edit[index][inx]){
                        this.setState({editWords: this.state.editWords.map((catWords,ix)=> ix!==index?catWords:  //finding the category
                            catWords.map((word,indx)=> indx!==inx ?word :this.state.words[this.state.index][i])) })
                        this.setState({editOffensive: this.state.editOffensive.map((catOffensive,ix)=> ix!==index?catOffensive:
                            catOffensive.map((offensive,indx)=> indx!==inx ?offensive :this.state.offClassification[this.state.index][i])) })
                    }
                }
            }
        }
        this.setState({words: words, offClassification: offClassification, wordCount: wordCount,id: id})
        console.log(words, offClassification, edit)
    }

    onSubmit = event => {
        event.preventDefault();
        axios.post(API.Add_Training, JSON.stringify({        //add training data
            "text": this.state.word,
            "offensive": this.state.Offensive,
            "category": this.state.category[this.state.index]
        }),
            { headers: { "Content-Type": "application/json" } })
            .then(res => (res.data))
            .then((data) => {
                if (!data.status == 200) {
                    alert('error adding data')
                }
            })
        // this.state.wordCount[this.state.index] = this.state.wordCount[this.state.index] + 1
        // this.state.words[this.state.index] = this.state.words[this.state.index].concat(this.state.word)
        // this.state.offClassification[this.state.index] = this.state.offClassification[this.state.index].concat(this.state.Offensive)
        // edit[this.state.index] = edit[this.state.index].concat(false)
        // this.state.editWords[this.state.index] = this.state.editWords[this.state.index].concat(this.state.word)
        // this.state.editOffensive[this.state.index] = this.state.editOffensive[this.state.index].concat(this.state.Offensive)
        // this.forceUpdate();
        this.getData(1)
        console.log(this.state.wordCount, this.state.words, this.state.offClassification);
        this.setState({ word: '', Offensive: '' })          //resetting handle change values
        this.getData(1)

    }

    categorySelect = (index) => {                           //switching between categories
        console.log(this.state.category[index]);
        for (var j = 0; j < 3; j++) {                       //changing the background color of selected category
            if (j === index) {
                b[j] = '#E0E0E0';
            } else {
                b[j] = '#F7F8F8';
            }
        }
        this.setState({
            index: index
        }, () => {
            for (var i = 0; i < edit[index].length; i++) {  //setting the 'edit' hide and 'done' display a/c to the category
                if (!edit[index][i]) {                      //'edit' button not selected
                    this.hide(i)
                } else {                                    //'done' and cancel display
                    this.display(i)
                }
            }
        });
    }

    handleSelect = (event) => {                             //offensive range selecton - add new data
        this.setState({ Offensive: event.target.value })
        console.log(event.target.value)
    }

    onHandleChange = (event) => {                           //handle text - add new data
        this.setState({ word: event.target.value })         //input text value
    }

    display = (i) => {                                      //display the 'edit' on mouse over and display 'done' on select the edit
        document.getElementById(this.state.index + " edit " + i).style.display = 'inline';
    }

    hide = (i) => {                                         //hide 'edit' button on mouse out
        if (!edit[this.state.index][i]) {
            document.getElementById(this.state.index + " edit " + i).style.display = 'none';
        }
    }

    edit = (i) => {
        if (edit[this.state.index][i]) {                    //cheching whether 'done' button or not

            //     axios.put(API.Add_Training,{ params: {id:this.state.id[this.state.index][i]}},
            //         JSON.stringify({ "text": this.state.editWords[this.state.index][i],
            //     "offensive": this.state.editOffensive[this.state.index][i],
            //     "category": this.state.category[this.state.index]}) , 
            //             { headers: {  "Content-Type": "application/json"  }})
            //     .then(res => (res.data))
            //     .then((data) => {
            //         if(!data.status===200){
            //         alert('error adding data')
            //         }
            // })
            edit[this.state.index][i] = false               //'edit' selection false
            this.setState({words: this.state.words.map((catWords,ix)=> ix!==this.state.index?catWords:   //finding the category
                catWords.map((word,indx)=> indx!==i ?word :this.state.editWords[this.state.index][i])) })//updating the edit
            this.setState({offClassification: this.state.offClassification.map((catOffensive,ix)=> ix!==this.state.index?catOffensive:
                catOffensive.map((offensive,indx)=> indx!==i ?offensive :this.state.editOffensive[this.state.index][i])) })
            document.getElementById(this.state.index + " edit " + i).style.display = 'none';    //hiding the 'edit' button
        } else {                                            //'edit' selection
            console.log('edit ' + this.state.words[this.state.index][i]);
            edit[this.state.index][i] = true;                //'edit' selection true
            this.setState({reload:1})
            document.getElementById(this.state.index + " edit " + i).style.display = 'inline';  //displaying the 'done' and cancel
        }
    }

    noEditing = (i) => {
        if (edit[this.state.index][i]) {                    //return false for edit selected data
            return false;
        }
        return true;
    }

    onEditText = (i, event) => {                            //handle change - edit data
        this.setState({editWords: this.state.editWords.map((catWords,ix)=> ix!==this.state.index?catWords:  //finding the category
            catWords.map((word,indx)=> indx!==i ?word :event.target.value)) })
    }

    editSelect = (i, event) => {                            //offensive range selection - edit data
        this.setState({editOffensive: this.state.editOffensive.map((catOffensive,ix)=> ix!==this.state.index?catOffensive:
            catOffensive.map((offensive,indx)=> indx!==i ?offensive :event.target.value)) })
    }

    cancel = (i) => {                                       // cancel editing
        console.log('Cancel edit ' + this.state.words[this.state.index][i]);
        edit[this.state.index][i] = false                   // 'edit' selection false
        this.setState({editWords: this.state.editWords.map((catWords,ix)=> ix!==this.state.index?catWords:  //finding the category
            catWords.map((word,indx)=> indx!==i ?word :this.state.words[this.state.index][i])) })
        this.setState({editOffensive: this.state.editOffensive.map((catOffensive,ix)=> ix!==this.state.index?catOffensive:
            catOffensive.map((offensive,indx)=> indx!==i ?offensive :this.state.offClassification[this.state.index][i])) })
        // this.state.editWords[this.state.index][i] = this.state.words[this.state.index][i]
        // this.state.editOffensive[this.state.index][i] = this.state.offClassification[this.state.index][i]
        // this.forceUpdate();                                 //removing changes from the data
        document.getElementById(this.state.index + " edit " + i).style.display = 'none';    //hide 'edit' button
    }


    render() {
        const { classes } = this.props;                     // with styles classes

        return (
            <div>
                <div>
                    <h4 style={{ float: 'left', marginLeft: '4%', marginTop: '0.25%' }}>Categories</h4>
                    <div style={{ width: '17%', float: 'left', marginTop: '3%', marginLeft: '-6.5%' }}>
                        <List className={classes.root}>
                            {this.state.category.map((listData, i) => (                     //mapping categories
                                <ListItem onClick={() => this.categorySelect(i)}
                                    style={{ height: 45, backgroundColor: b[i] }} key={i}>
                                    <ListItemText key={i} primary={listData} />              {/*listing categories*/}
                                    <div key={i + 100} style={{
                                        float: 'right', color: '#0074B6',
                                        fontSize: '18px', flexDirection: 'column'
                                    }}>
                                        {this.state.wordCount[i]}                           {/*displaying category word cout*/}
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>

                <div style={{ marginLeft: '24%' }}>                                           {/*data section*/}
                    <h4 style={{ marginTop: '3%', marginBottom: '1%' }}>Training Data</h4>
                    <div style={{ marginBottom: '2%' }}>
                        <form onSubmit={this.onSubmit}>                                     {/*add new data form*/}
                            <TextField style={{ width: '49.8%', backgroundColor: 'white' }}   //input text
                                className={classes.textField} variant='standard'
                                label=" + Add text to classify"
                                required InputLabelProps={{ required: false }}               //required field, hide '*'
                                value={this.state.word} onChange={this.onHandleChange} />
                            <FormControl className={classes.formControl} className={classes.textField}
                                style={{ backgroundColor: 'white', width: '19.8%', marginLeft: '1%', marginTop: '0%' }}
                                variant='standard' color='primary'>                         {/*offenive range selection*/}
                                <InputLabel style={{ color: '#0074B6' }}>Select Offensive Range</InputLabel>
                                <Select value={this.state.Offensive} onChange={this.handleSelect} required>
                                    <MenuItem value={'Lightly Offensive'}>Lightly Offensive</MenuItem>
                                    <MenuItem value={'Offensive'}>Offensive</MenuItem>
                                    <MenuItem value={'Extremely Offensive'}>Extremely Offensive</MenuItem>
                                </Select>
                            </FormControl>
                            <Button type='submit' variant="contained" color='primary'        //Submit button
                                style={{
                                    border: 'none', width: '12.8%', height: 50,
                                    textTransform: 'none', marginLeft: '1%'
                                }}>
                                Submit
                            </Button>
                        </form>
                    </div>

                    <div style={{ marginTop: '-1.5%' }}>                                      {/*edit data section*/}
                        {this.state.words[this.state.index].map((word, i) => (              //mapping training data in the selected category
                            <div key={i} onMouseOver={() => this.display(i)}
                                onMouseOut={() => this.hide(i)}>                            {/*hiding and displaying of 'edit' button*/}
                                <TextField variant="outlined" disabled={this.noEditing(i)}  //disabling non editing text field
                                    onChange={(e) => this.onEditText(i, e)}
                                    value={this.state.editWords[this.state.index][i]}
                                    required InputLabelProps={{ required: false }}
                                    style={{ width: '50%', marginBottom: '0.5%', marginTop: '0%', backgroundColor: 'white' }} />
                                <FormControl className={classes.formControl} variant='outlined'
                                    style={{
                                        width: '20%', marginBottom: '0.5%', marginLeft: '1%',
                                        backgroundColor: 'white', marginTop: '-0%'
                                    }}>           {/*offensive range selection*/}
                                    <Select required disabled={this.noEditing(i)} onChange={(e) => this.editSelect(i, e)}
                                        value={this.state.editOffensive[this.state.index][i]}>
                                        <MenuItem value={'Lightly Offensive'}>Lightly Offensive</MenuItem>
                                        <MenuItem value={'Offensive'}>Offensive</MenuItem>
                                        <MenuItem value={'Extremely Offensive'}>Extremely Offensive</MenuItem>
                                    </Select>
                                </FormControl>
                                <div id={this.state.index + " edit " + i} style={{ display: 'none' }}>    {/*'edit' or 'done' button'*/}
                                    <Button variant={this.noEditing(i) ? 'outlined' : 'contained'} color='primary'
                                        style={{
                                            width: '13%', height: 55, textTransform: 'none',
                                            marginLeft: '0.2%', marginBottom: '0.5%', marginTop: '0%'
                                        }}
                                        onClick={() => this.edit(i)}>
                                        {this.noEditing(i) ? 'Edit' : 'Done'}                   {/*display 'edit' for non edit, else 'done'*/}
                                    </Button>
                                    {this.noEditing(i) ? null : <IconButton size='small'
                                            onClick={() => this.cancel(i)} >                    {/*display cancel with 'done'*/}
                                        <CancelIcon color='primary' fontSize='large'
                                            style={{ marginLeft: '1%', marginBottom: '-1%', marginTop: '0%' }} />
                                    </IconButton>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(useStyles)(TrainingData);