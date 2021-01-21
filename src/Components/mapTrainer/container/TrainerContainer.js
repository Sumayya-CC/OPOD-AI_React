import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MapTrainerService from "../../../services/mapTrainer.service";
import TrainerView from "../view/TrainerView";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    background: "#F7F8F8",
    borderRadius: 0,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TrainerContainer(props) {
  const classes = useStyles();

  const [nextImage, setNextImage] = useState();
  //   const [prevImage, setPrevImage] = useState();
  const [classesOfImage, setClassesOfImage] = useState();

  useEffect(() => {
    getNextImage();
    getClasses();
  }, []);

  function getNextImage() {
    MapTrainerService.fetchNextImage().then((res) => {
      if (res.data) {
        setNextImage(res.data);
      }
    });
  }

  function getClasses() {
    MapTrainerService.fetchClasses().then((res) => {
      if (res.data && res.data.code === 200) {
        setClassesOfImage(res.data.classes);
      }
    });
  }

  function saveData(data) {
    MapTrainerService.saveData(JSON.stringify(data.data)).then((res) => {
      if(res.data.code === 200) {
          getNextImage();
      }
    });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Typography component="div">
        <Box fontWeight="fontWeightBold" mt={5} ml={5} className="heading-1">
          India Map Trainer
        </Box>
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <TrainerView
            nextImage={nextImage}
            classesOfImage={classesOfImage}
            getNextImage={getNextImage}
            saveData={saveData}
          />
        </Grid>
      </Grid>
    </div>
  );
}
