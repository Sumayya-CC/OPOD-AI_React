import React from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import "./Style.css";
import Report from "./Report";
import logo from "./tarentologo.png";
import TrainingData from "./TrainingData";
import ImageProfanityContainer from "./imageProfanity/container/ImageProfanityContainer";
import MapDetectorContainer from "./mapDetector/container/MapDetectorContainer";
import TrainerContainer from "./mapTrainer/container/TrainerContainer";
import ChatWidget from "./AI assistant/ChatWidget";
import Welcome1 from "./Text Profanity Real Time/TextProfanity1";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#303055",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "#303055",
      opacity: 1,
    },
    "&$selected": {
      color: "#303055",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#303055",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: 0,
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
      <div style={{ backgroundColor: "white", display: "flex" }}>
        <img
          alt="iGOT"
          src={logo}
          style={{
            width: "8em",
            height: "20%",
            marginLeft: "5em",
            marginTop: "0.65em"
          }}
        />
        <AntTabs
          value={value}
          onChange={handleChange}
          aria-label="ant example"
          style={{ marginLeft: "12%" }}
        >
          <AntTab label="Profanity Check" {...a11yProps(0)} /> {/*first tab*/}
          <AntTab label="Training Data" {...a11yProps(1)} /> {/*second tab*/}
          {/*third tab*/}
          <AntTab label="Image Profanity" {...a11yProps(2)} />
          {/*fourth tab*/}
          <AntTab label="India Map Detector" {...a11yProps(3)} />
          {/*fifth tab*/}
          <AntTab label="India Map Trainer" {...a11yProps(4)} />
          {/*sixth tab*/}
          <AntTab label="AI assistant" {...a11yProps(5)} /> 
          <AntTab label="Text Profanity - Real Time Feedback" {...a11yProps(6)} />
        </AntTabs>

        
      </div>

      <div>
        <Typography className={classes.padding} />
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {value === 0 && (
            <TabPanel
              // value={value} index={0} dir={theme.direction}>
              hidden={value === 1}
            >
              {" "}
              {/*displaying 1st tab by hiding 2nd tab*/}
              <Report /> {/*Check profanity and display result*/}
            </TabPanel>
          )}

          {value === 1 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0}
            >
              {" "}
              {/*displaying 2nd tab by hiding 1st tab*/}
              <TrainingData /> {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}

          {value === 2 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0 && value === 1}
            >
              {" "}
              {/*displaying 3nd tab by hiding 1st and 2nd tabs*/}
              <ImageProfanityContainer />{" "}
              {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}

          {value === 3 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0 && value === 1 && value === 2}
            >
              {" "}
              {/*displaying 3nd tab by hiding 1st and 2nd tabs*/}
              <MapDetectorContainer />{" "}
              {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}
          {value === 4 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0 && value === 1 && value === 2}
            >
              {" "}
              {/*displaying 3nd tab by hiding 1st and 2nd tabs*/}
              <TrainerContainer />{" "}
              {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}
                    {value === 5 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0 && value === 1 && value === 2}
            >
              {" "}
              {/*displaying 3nd tab by hiding 1st and 2nd tabs*/}
              <ChatWidget />{" "}
              {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}
          {value === 6 && (
            <TabPanel
              // value={value} index={1} dir={theme.direction}>
              hidden={value === 0 && value === 1 && value === 2}
            >
              {" "}
              {/*displaying 3nd tab by hiding 1st and 2nd tabs*/}
              <Welcome1 />{" "}
              {/*adda nd edit training data set (incomplete)*/}
            </TabPanel>
          )}
         
        </SwipeableViews>
      </div>
    </div>
  );
}
