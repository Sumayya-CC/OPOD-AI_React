import React,{Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import './Style.css';
 
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
        color:'white',
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
        textField: {
          color: "black",
          // minHeight: '40%', 
          background:'#FFFFFF',
          borderWidth:1,
          borderColor:'#0074B6',
          borderStyle:'solid',
          
          
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
          color:'#0074B6',
          marginLeft:'1%',
          marginTop:'-1%'
          }, 
          '& .MuiInputLabel-shrink': {
            color:'#0074B6',
          },
          },
  });
  
var b=['#E0E0E0', '#F7F8F8', '#F7F8F8'];
var edit;

class TrainingData extends Component{
    constructor(props){
        super(props); 
        this.state = {
            category:['Unparliamentary Words', 'Culturally Sensitive', 'Politically Sensitive',],
            wordCount:[5,6,3],
            words:[[]],
            classification:[[]],
            Offensive:'',
            word:'',
            index:0,
            editWords:[],
            editOffensive:[],
            edit:[],
        }  
    }

    componentDidMount(){
        
        this.setState({ words:[['bribe', 'double-talk', 'racist', 'blackmail', 'blind',],
        ['fuck', 'asshole', 'bitch', 'mofo', 'ho', 'bastard', ], 
        ['dfs', 'ahd', 'kgf']],
        classification:[['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Lightly Offensive', 'Offensive', ],
        ['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Offensive', 'Offensive', 'Lightly Offensive',],
        ['Offensive', 'Lightly Offensive', 'Extremely Offensive',]],});
        edit=[[false, false, false, false, false,],
        [false, false, false, false, false, false, ], 
        [false, false, false]];
        this.setState({editWords:[['bribe', 'double-talk', 'racist', 'blackmail', 'blind',],
        ['fuck', 'asshole', 'bitch', 'mofo', 'ho', 'bastard', ], 
        ['dfs', 'ahd', 'kgf']], 
        editOffensive:[['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Lightly Offensive', 'Offensive', ],
        ['Offensive', 'Lightly Offensive', 'Extremely Offensive', 'Offensive', 'Offensive', 'Lightly Offensive',],
        ['Offensive', 'Lightly Offensive', 'Extremely Offensive',]]});
        // for(var i=0;i<this.state.words.length;i++){
        //     edit=edit.concat([[]]);
        //     for(var j=0; j<this.state.words[i].length;j++){
        //         edit[i]=edit[i].concat(false)
        //         this.forceUpdate();
        //     }
        // }
        console.log( this.state.editWords)
    }

    onSubmit = event =>{
        event.preventDefault();
        this.state.wordCount[this.state.index] = this.state.wordCount[this.state.index]+1
        this.state.words[this.state.index] = this.state.words[this.state.index].concat(this.state.word)
        this.state.classification[this.state.index] = this.state.classification[this.state.index].concat(this.state.Offensive)
        edit[this.state.index] = edit[this.state.index].concat(false)
        this.state.editWords[this.state.index] = this.state.editWords[this.state.index].concat(this.state.word)
        this.state.editOffensive[this.state.index] = this.state.editOffensive[this.state.index].concat(this.state.Offensive)
        this.forceUpdate();
        console.log(this.state.wordCount, this.state.words, this.state.classification);
        this.setState({word:'', Offensive:''})

    }

    categorySelect=(index)=>{
        console.log(this.state.category[index]);
        for(var j=0; j<3; j++){
            if(j===index){
                b[j]='#E0E0E0';
            }else{
                b[j]='#F7F8F8';
            }
        }
        this.setState({index:index}, () => {
        for(var i=0; i<edit[index].length; i++){
            if(!edit[index][i]){
                this.hide(i)
            }else{
                this.display(i)
            }
        }
    });
    }
    
    handleSelect = (event) =>{
        this.setState({Offensive:event.target.value})
        console.log(event.target.value)
      }

      onHandleChange = (event) => {
        this.setState ({word:event.target.value}) //input value
      }
      
      display=(i)=>{
        document.getElementById(this.state.index +" edit "+ i).style.display = 'inline';
      }
      
      hide=(i)=>{
        if(!edit[this.state.index][i]){
            document.getElementById(this.state.index +" edit "+ i).style.display = 'none';
        }
      }

      edit=(i)=>{
          if(edit[this.state.index][i]){
            this.state.words[this.state.index][i] = this.state.editWords[this.state.index][i]
            this.state.classification[this.state.index][i] = this.state.editOffensive[this.state.index][i]
            edit[this.state.index][i]=false
            this.forceUpdate();
            document.getElementById(this.state.index +" edit "+ i).style.display = 'none';
          }else{
            console.log('edit '+this.state.words[this.state.index][i]);
            edit[this.state.index][i]=true
            this.forceUpdate();
            document.getElementById(this.state.index +" edit "+ i).style.display = 'inline';
          }
      }

      noEditing=(i)=>{
            if(edit[this.state.index][i]){
                return false;
            }
            return true;
      }

      onEditText=(i,event)=>{
          this.state.editWords[this.state.index][i]=event.target.value
          this.forceUpdate();
      }

      editSelect= (i,event)=>{
          this.state.editOffensive[this.state.index][i]=event.target.value
          this.forceUpdate();
      }
      
      cancel = (i) =>{
        console.log('Cancel edit '+this.state.words[this.state.index][i]);
        edit[this.state.index][i]=false
        this.state.editWords[this.state.index][i]=this.state.words[this.state.index][i]
        this.state.editOffensive[this.state.index][i]= this.state.classification[this.state.index][i]
        this.forceUpdate();
        document.getElementById(this.state.index +" edit "+ i).style.display = 'none';
      }


    render(){
        const { classes } = this.props;
        return(
            <div>
                <div>
                    <h4 style={{float:'left',marginLeft:'4%',marginTop:'0.25%'}}>Categories</h4>
                    <div style={{width:'17%',float:'left',marginTop:'3%',marginLeft:'-6.5%',}}>
                        <List className={classes.root}>
                        {this.state.category.map((listData, i) =>(
                            <ListItem onClick={()=>this.categorySelect(i)} style={{height:45, backgroundColor:b[i]}} key={i}>
                                <ListItemText key={i} primary={listData}/>
                                <div key={i+100} style = {{float:'right', color:'#0074B6',fontSize:'18px', flexDirection:'column'}}>{this.state.wordCount[i]}</div>
                            </ListItem>
                            ))}
                        </List>
                    </div>
                </div>

                <div style={{marginLeft:'24%'}}>
                    <h4 style={{marginTop:'3%', marginBottom:'1%'}}>Training Data</h4>
                    <div style = {{marginBottom:'2%', }}>
                        <form onSubmit={this.onSubmit}>
                            <TextField style = {{width:'49.8%', backgroundColor:'white',}} className={classes.textField}
                                label=" + Add text to classify" variant='standard'  onChange = {this.onHandleChange} 
                                required InputLabelProps={{required: false,}} value={this.state.word}/>
                            <FormControl className={classes.formControl} variant='standard' color='primary' className={classes.textField}
                                style={{backgroundColor:'white',marginLeft:'1%', width:'19.8%', marginTop:'0%'}}>
                                <InputLabel style={{color:'#0074B6'}}>Select Category</InputLabel>
                                <Select value={this.state.Offensive} onChange={this.handleSelect} required>
                                    <MenuItem value={'Lightly Offensive'}>Lightly Offensive</MenuItem>
                                    <MenuItem value={'Offensive'}>Offensive</MenuItem>
                                    <MenuItem value={'Extremely Offensive'}>Extremely Offensive</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color='primary' style={{ border:'none',    //Submit button
                            width:'12.8%', height: 50, textTransform: 'none', marginLeft:'1%', }} type='submit'> Submit </Button>
                        </form>
                    </div>
             
                    <div style = {{marginTop:'-1.5%'}}> 
                        {this.state.words[this.state.index].map((word, i)=>(
                        <div key={i} onMouseOver={()=>this.display(i)} onMouseOut={()=>this.hide(i)}>
                            <TextField variant="outlined" disabled={this.noEditing(i)}  onChange = {(e)=>this.onEditText(i, e)} 
                                required InputLabelProps={{required: false,}} value={this.state.editWords[this.state.index][i]}
                            style = {{width:'50%',marginBottom:'0.5%', marginTop:'0%', backgroundColor:'white'}}/> 
                            <FormControl className={classes.formControl} variant='outlined' 
                                style={{width:'20%',marginBottom:'0.5%',marginLeft:'1%', backgroundColor:'white',marginTop:'-0%'}}>
                                <Select disabled={this.noEditing(i)} 
                                value={this.state.editOffensive[this.state.index][i]} onChange={(e)=>this.editSelect(i,e)} required>
                                    <MenuItem value={'Lightly Offensive'}>Lightly Offensive</MenuItem>
                                    <MenuItem value={'Offensive'}>Offensive</MenuItem>
                                    <MenuItem value={'Extremely Offensive'}>Extremely Offensive</MenuItem>
                                </Select>
                            </FormControl>
                            <div id={this.state.index +" edit "+ i} style={{display:'none'}}>
                            <Button variant={this.noEditing(i)?'outlined':'contained'} color='primary' 
                            style={{width:'13%', height: 55, textTransform:'none',  marginLeft:'0.2%',  marginBottom:'0.5%', marginTop:'0%'}} 
                            onClick={()=>this.edit(i)}> {this.noEditing(i)? 'Edit':'Done'} </Button>
                            {this.noEditing(i)? null:<IconButton size='small'>
                                <CancelIcon color='primary' fontSize='large'
                            style={{marginLeft:'1%',  marginBottom:'-1%', marginTop:'0%'}} 
                            onClick={()=>this.cancel(i)}/>
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

export default withStyles(useStyles) (TrainingData);