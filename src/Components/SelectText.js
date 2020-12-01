import React, { Component } from 'react';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import './Style.css';


const styles = (theme) => ({

    formControl: {
        margin: theme.spacing(1),
        width: '90%',
        color: '#F5F5F5',
        height: '10%',
        marginLeft: '5%'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

});


class SelectedText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            offRange: "Offensive",

        }
    }


    handleSelect = event => {                                           //text handling
        this.setState({ category: event.target.value })
        console.log(event.target.value)
    }

    handleRange = event => {                                            //offensive range selection
        this.setState({ offRange: event.target.value })
        console.log(event.target.value)
    }

    addTrainingData = event => {                                       //add training data (function in Report.js)
        event.preventDefault();
        this.props.addTraining(this.state.offRange, this.state.category);
    }


    render() {
        const { classes } = this.props;                     // with styles classes

        return (
            <div align='justify'>
                <div style={{
                    color: 'black', align: "center", marginTop: '-10%',
                    marginRight: '33%', display: 'inline-flex', float: 'right'
                }}>
                    <CloudDownloadIcon style={{ marginLeft: "0%", color: "black", marginRight: '5%' }} />
                  Export_Summary
              </div>

                <div style={{
                    marginTop: '22%', backgroundColor: '#ffffff', minHeight: 450, width: '90%', overflow: 'unset',
                    borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid', marginRight: '30%'
                }}>

                    <form onSubmit={this.addTrainingData}>
                        <div style={{ textAlign: 'center', color: '#D0D0D0', }}>
                            <h4 style={{ float: 'left', color: '#000000', marginTop: '3%', marginLeft: '3%' }}>
                                Selected text
                            </h4>
                            <IconButton className={"MyCustomButton"} style={{ float: 'right' }}                         //close
                                onClick={this.props.closeTraining}>
                                <CloseIcon color='primary' />
                            </IconButton>
                            <TextField id="outlined-basic" value={this.props.selected_text} multiline
                                rowsmin={2} variant="outlined" required InputLabelProps={{ required: false, }}          //text
                                style={{ width: '90%', marginTop: '-3%', marginBottom: '3%', }}
                                onChange={this.props.changeSelect} />
                        </div>

                        <div>
                            <h4 style={{ color: '#000000', marginTop: '3%', marginLeft: '3%', marginBottom: '-1%' }}>
                                Offensive Range
                                </h4>
                            <div style={{ marginTop: '1%', marginLeft: '5%', width: '100%', }}>                         {/*offensive range*/}
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="Offensiveness" name="Offensiveness"
                                        value={this.state.offRange} onChange={this.handleRange}>
                                        <div>
                                            <FormControlLabel value="Lightly Offensive"
                                                control={<Radio color='primary' />} label='Lightly Offensive' />
                                            <FiberManualRecordIcon
                                                style={{ color: '#E77100', float: "right", flexdirection: "coloumn" }} />{/*offensive color*/}
                                        </div>
                                        <div>
                                            <FormControlLabel value="Offensive"
                                                control={<Radio color='primary' />} label="Offensive" />
                                            <FiberManualRecordIcon
                                                style={{ color: '#EC0000', flexdirection: "coloumn", float: "right" }} />
                                        </div>
                                        <div>
                                            <FormControlLabel value="Extremely Offensive"
                                                control={<Radio color='primary' />} label="Extremely Offensive" />
                                            <FiberManualRecordIcon
                                                style={{ color: '#AA0000', flexdirection: "coloumn", float: 'right' }} />
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                        <div>
                            <FormControl className={classes.formControl} variant="filled">                              {/*category selection*/}
                                <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                                <Select labelId="demo-simple-select-label" id="demo-simple-select" required
                                    value={this.state.category} onChange={this.handleSelect}>
                                    <MenuItem value={'Unparlimentary words'}>Unparlimentary words</MenuItem>
                                    <MenuItem value={'Culturally Sensitive'}>Culturally Sensitive</MenuItem>
                                    <MenuItem value={'Politically Sensitive'}>Politically Sensitive</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <Button variant='outlined' color='primary' type='submit'
                                style={{ textTransform: 'none', marginLeft: '5%', width: '90%' }} >                     {/*Submit button*/}
                                Add to Training Data
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SelectedText);