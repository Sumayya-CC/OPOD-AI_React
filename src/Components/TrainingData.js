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

class TrainingData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: ['Unparliamentary Words', 'Culturally Sensitive', 'Politically Sensitive',],
            Offensive: '',
            text: '',
            index: 0,
            trData: [[], [], []],
            textCount: [],
            edData: [[], [], []],
        }
    }
    componentWillUpdate() {
        this.getData(1)
    }

    componentDidMount() {           //initial function
        this.getData(0);
    }

    getData = (a) => {
        axios.get(API.Add_Training)                                   //get all training data to display
            .then(response => {
                var data = response.data.payload
                console.log(data)
                var trData = [[], [], []], edData = [[], [], []], textCount = [], c;
                for (var i = 0; i < data.length; i++) {
                    for (var catg = 0; catg < 3; catg++) {           //recurring through every training data
                        if (data[i].category === this.state.category[catg]) {      //category 
                            c = catg;
                        }
                    }
                    trData[c] = trData[c].concat([{
                        'id': data[i].id,
                        'text': data[i].text, 'offensive': data[i].offensive
                    }])
                }
                for (let ct = 0; ct < 3; ct++) {
                    textCount = textCount.concat(trData[ct].length)  //data count in each categories
                }
                if (!a) {                      //initial setup, all edit selection false, edit data = training data
                    for (var k = 0; k < 3; k++) {
                        for (var j = 0; j < trData[k].length; j++) {
                            edData[k] = edData[k].concat([{
                                'id': trData[k][j].id, 'edit': false,
                                'text': trData[k][j].text, 'offensive': trData[k][j].offensive
                            }]);
                        }
                    }
                } else {
                    edData = this.state.edData;
                    for (let index = 0; index < 3; index++) {                               //updating edit data
                        let inx = 0;
                        while (inx < edData[index].length && inx < trData[index].length) {
                            if (trData[index][inx].id !== edData[index][inx].id) {          //comparing id
                                edData[index].splice(inx, 1)                                //remove deleted data
                            }
                            if (!edData[index][inx].edit) {                                 //update non edit data
                                edData[index][inx].text = trData[index][inx].text;
                                edData[index][inx].offensive = trData[index][inx].offensive;
                            }
                            inx++;
                        }
                        edData[index].splice(trData[index].length)                          //remove deleted data at the end
                        for (let ex = edData[index].length; ex < trData[index].length; ex++) {
                            edData[index] = edData[index].concat([{                         //add new data
                                'id': trData[index][ex].id, 'edit': false,
                                'text': trData[index][ex].text, 'offensive': trData[index][ex].offensive
                            }]);
                        }
                    }
                }
                this.setState({ trData: trData, edData: edData, textCount: textCount })
                console.log(edData, trData)
            });
    }

    onSubmit = event => {
        event.preventDefault();
        axios.post(API.Add_Training, JSON.stringify({        //add training data
            "text": this.state.text,
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
        this.setState({ text: '', Offensive: '' })          //resetting handle change values

    }

    categorySelect = (index) => {                           //switching between categories
        console.log(this.state.category[index])
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
            for (var i = 0; i < this.state.edData[index].length; i++) {  //setting the 'edit' hide and 'done' display a/c to the category
                if (!this.state.edData[index][i].edit) {     //'edit' button not selected
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
        this.setState({ text: event.target.value })         //input text value
    }

    display = (i) => {                                      //display the 'edit' on mouse over and display 'done' on select the edit
        document.getElementById(this.state.index + " edit " + i).style.display = 'inline';
    }

    hide = (i) => {                                         //hide 'edit' button on mouse out
        if (!this.state.edData[this.state.index][i].edit) {
            document.getElementById(this.state.index + " edit " + i).style.display = 'none';
        }
    }

    edit = (i) => {
        if (this.state.edData[this.state.index][i].edit) {                    //cheching whether 'done' button or not
            //     axios.put(API.Add_Training,{ params: {id:this.state.edData[this.state.index][i].id}},
            //         JSON.stringify({ "text": this.state.edData[this.state.index][i].text,
            //     "offensive": this.state.edData[this.state.index][i].offensive,
            //     "category": this.state.category[this.state.index]}) , 
            //             { headers: {  "Content-Type": "application/json"  }})
            //     .then(res => (res.data))
            //     .then((data) => {
            //         if(!data.status===200){
            //         alert('error adding data')
            //         }
            // })      
            this.setState({
                trData: this.state.trData.map((catData, ix) => ix !== this.state.index ? catData :   //finding the category
                    catData.map((data, indx) => indx !== i ? data : {
                        ...data, text: this.state.edData[this.state.index][i].text,
                        offensive: this.state.edData[this.state.index][i].offensive
                    })),
                edData: this.state.edData.map((catData, ix) => ix !== this.state.index ? catData :      //'edit' selection false
                    catData.map((data, indx) => indx !== i ? data : { ...data, edit: false })),
            })
            document.getElementById(this.state.index + " edit " + i).style.display = 'none';    //hiding the 'edit' button
        }
        else {                                                                                //'edit' selection
            console.log('edit ' + this.state.trData[this.state.index][i].text);
            this.setState({
                edData: this.state.edData.map((catData, ix) => ix !== this.state.index ? catData :      //'edit' selection true
                    catData.map((data, indx) => indx !== i ? data : { ...data, edit: true })),
            })
            document.getElementById(this.state.index + " edit " + i).style.display = 'inline';  //displaying the 'done' and cancel
        }
    }

    noEditing = (i) => {
        if (this.state.edData[this.state.index][i].edit) {                    //return false for edit selected data
            return false;
        }
        return true;
    }

    onEditText = (i, event) => {                            //handle change - edit data
        this.setState({
            edData: this.state.edData.map((catData, ix) => ix !== this.state.index ? catData :
                catData.map((data, indx) => indx !== i ? data : { ...data, text: event.target.value })),
        })
    }

    editSelect = (i, event) => {                            //offensive range selection - edit data
        this.setState({
            edData: this.state.edData.map((catData, ix) => ix !== this.state.index ? catData :
                catData.map((data, indx) => indx !== i ? data : { ...data, offensive: event.target.value })),
        })
    }

    cancel = (i) => {                                       // cancel editing
        console.log('Cancel edit ' + this.state.trData[this.state.index][i].text);
        this.setState({                             //edit false, edit data= training data
            edData: this.state.edData.map((catData, ix) => ix !== this.state.index ? catData :
                catData.map((data, indx) => indx !== i ? data : {
                    ...data, edit: false, text: this.state.trData[this.state.index][i].text,
                    offensive: this.state.trData[this.state.index][i].offensive
                })),
        })
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
                                        {this.state.textCount[i]}                          {/*displaying category text count */}
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
                                value={this.state.text} onChange={this.onHandleChange} />
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
                                    border: 'none', width: '13%', height: 50,
                                    textTransform: 'none', marginLeft: '1.3%'
                                }}>
                                Submit
                            </Button>
                        </form>
                    </div>

                    <div style={{ marginTop: '-1.5%' }}>                                      {/*edit data section*/}
                        {this.state.edData[this.state.index].map((data, i) => (              //mapping training data in the selected category
                            <div key={i} onMouseOver={() => this.display(i)}
                                onMouseOut={() => this.hide(i)}>                            {/*hiding and displaying of 'edit' button*/}
                                <TextField variant="outlined" disabled={this.noEditing(i)}  //disabling non editing text field
                                    onChange={(e) => this.onEditText(i, e)}
                                    value={this.state.edData[this.state.index][i].text}
                                    required InputLabelProps={{ required: false }}
                                    style={{ width: '50%', marginBottom: '0.5%', marginTop: '0%', backgroundColor: 'white' }} />
                                <FormControl className={classes.formControl} variant='outlined'
                                    style={{
                                        width: '20%', marginBottom: '0.5%', marginLeft: '1%',
                                        backgroundColor: 'white', marginTop: '-0%'
                                    }}>           {/*offensive range selection*/}
                                    <Select required disabled={this.noEditing(i)} onChange={(e) => this.editSelect(i, e)}
                                        value={this.state.edData[this.state.index][i].offensive}>
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