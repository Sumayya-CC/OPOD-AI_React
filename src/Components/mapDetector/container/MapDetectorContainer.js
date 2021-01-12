import React, { useEffect, useState } from "react";
import MapDetectorUploadView from "../view/MapDetectorUploadView";
import MapDetectorResultView from "../view/MapDetectorResultView";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ImageUploadService from "../../../services/imageProfanity.service";

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

export default function MapDetectorContainer(props) {
  const classes = useStyles();

  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [imgValue, setImgValue] = useState("");

  function getFileData(value) {
    setValue(value);
  }

  function getImageValue(value) {
    setImgValue(value);
  }

  useEffect(() => {
    uploadFileService(value);
  }, [value]);

  function uploadFileService(value) {
    if (value && value !== undefined) {
      ImageUploadService.mapUpload(value).then((res) => {
        if (res.data.code === 200) {
          setData(res.data);
        }
      });
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Typography component="div">
        <Box fontWeight="fontWeightBold" mt={5} ml={6}>
          India Map Detector
        </Box>
      </Typography>
      <Grid container spacing={0}>
        {/* Right side */}
        <Grid item xs={12} md={6} lg={6}>
          <MapDetectorUploadView
            uploadFile={getFileData}
            sendImgValue={getImageValue}
          />
        </Grid>
        {/* Left side */}
        <Grid item xs={12} md={6} lg={6}>
          <MapDetectorResultView data={data} imgValue={imgValue} />
        </Grid>
      </Grid>
    </div>
  );
}
