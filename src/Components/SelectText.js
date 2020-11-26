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
            range: "Offensive",

        }
    }


    handleSelect = event => {
        this.setState({ category: event.target.value })
        console.log(event.target.value)
    }

    handleRange = event => {
        this.setState({ range: event.target.value })
        console.log(event.target.value)
    }

    addTrainingData = event => {
        event.preventDefault();
        this.props.addTraining(this.state.range, this.state.category);
    }


    render() {
        const { classes } = this.props;

        return (
            <div align='justify'>
                <div style={{ color: 'black', align: "center", marginTop: '-10%', marginRight: '33%', display: 'inline-flex', float: 'right', }}>
                    <CloudDownloadIcon style={{ marginLeft: "0%", color: "black", marginRight: '5%', }} />
                  Export_Summary
              </div>

                <div style={{
                    marginTop: '22%', backgroundColor: '#ffffff', minHeight: 450, width: '90%',
                    borderWidth: 1, borderColor: '#E2E2E2', borderStyle: 'solid', marginRight: '30%', overflow:'unset'
                }}>

                    <form onSubmit={this.addTrainingData}>
                        <div style={{ textAlign: 'center', color: '#D0D0D0', }}>
                            <h4 style={{ float: 'left', color: '#000000', marginTop: '3%', marginLeft: '3%' }}>Selected text</h4>
                            <IconButton className={"MyCustomButton"} style={{ float: 'right' }}
                                onClick={this.props.closeTraining}>
                                <CloseIcon color='primary' />
                            </IconButton>
                            <TextField id="outlined-basic" value={this.props.selected_text} multiline rowsMin={2} variant="outlined" required
                                InputLabelProps={{ required: false, }} style={{ width: '90%', marginTop: '-3%', marginBottom: '3%', }} 
                                onChange={this.props.changeSelect} />
                        </div>

                        <div>
                            <h4 style={{ color: '#000000', marginTop: '3%', marginLeft: '3%', marginBottom:'-1%' }}>Offensive Range</h4>
                            <div style={{ marginTop: '1%', marginLeft: '5%', width: '100%', }}>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="Offensiveness" name="Offensiveness" value={this.state.range} onChange={this.handleRange}>
                                        <div><FormControlLabel value="Lightly Offensive" control={<Radio color='primary' />} label='Lightly Offensive' />
                                            <FiberManualRecordIcon style={{ color: '#E77100', float: "right", flexdirection: "coloumn" }} /></div>
                                        <div><FormControlLabel value="Offensive" control={<Radio color='primary' />} label="Offensive" />
                                            <FiberManualRecordIcon style={{ color: '#EC0000', flexdirection: "coloumn", float: "right" }} /></div>
                                        <div><FormControlLabel value="Highly Offensive" control={<Radio color='primary' />} label="Highly Offensive" />
                                            <FiberManualRecordIcon style={{ color: '#AA0000', flexdirection: "coloumn", float: 'right' }} /></div>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>

                        <div>
                            <FormControl className={classes.formControl} variant="filled">
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
                            <Button variant='outlined' color='primary' style={{ textTransform: 'none', marginLeft: '5%', width: '90%' }}
                                type='submit'>Add to Training Data</Button>
                        </div>
                    </form>

                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SelectedText);