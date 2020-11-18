import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import './Style.css';
import Report from './Report'
import logo from './tarentologo.png';
import TrainingData from './TrainingData';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        // <Box p={3} >
          <div>{children}</div>
        // </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#303055',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#303055',
      opacity: 1,
    },
    '&$selected': {
      color: '#303055',
      fontWeight: theme.typography.fontWeightMedium,
      
    },
    '&:focus': {
      color: '#303055',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding:0
    // padding: theme.spacing(3),
  },
}));



export default function TabSelect(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const theme = useTheme();
  const handleChangeIndex = (index) => {
    setValue(index);
  };


  return (
    <div className={classes.root}>
      <div style={{backgroundColor:'white'}}>
        <img alt='iGOT' src={logo} style={{width:'6%', display:'inline-flex', marginLeft:'5%', marginTop:'1%'}}/>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example" style={{marginLeft:'12%', marginTop:'-3%'}}>
          <AntTab label="Profanity Check" {...a11yProps(0)}/>
          <AntTab label="Training Data" {...a11yProps(1)}/>
        </AntTabs>
      </div>

      <div>
        <Typography className={classes.padding}/>
        <SwipeableViews  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}>

        <TabPanel  
        // value={value} index={0} dir={theme.direction} 
        hidden={value === 1}>
          <Report/> 
        </TabPanel>

        <TabPanel  
        // value={value} index={1} dir={theme.direction} 
        hidden={value === 0}>
          <TrainingData/>
        </TabPanel>
        
        </SwipeableViews>
      </div>
    </div>
  );
}