import React, { useEffect, useState } from "react";
import MapDetectorUploadView from "../view/MapDetectorUploadView";
import MapDetectorResultView from "../view/MapDetectorResultView";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MapUploadService from "../../../services/mapProfanity.service";

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

  const [mapValue, setMapValue] = useState("");
  const [mapData, setMapData] = useState("");
  const [imgMapValue, setImgMapValue] = useState("");

  function getMapFileData(value) {
    setTimeout(() => {
      setMapValue(value);
    }, 550);
  }

  function getMapImageValue(value) {
    setTimeout(() => {
      setImgMapValue(value);
    }, 600);
  }

  useEffect(() => {
    uploadMapFileService(mapValue);
  }, [mapValue]);

  function uploadMapFileService(value) {
    setMapData("");
    if (value && value !== undefined) {
      MapUploadService.mapUpload(value).then((res) => {
        if (
          res.data.code === 200 &&
          res.data.payload.india_classification.length &&
          res.data.payload.india_classification[0].present
        ) {
          setMapData(res.data);
        }

        if (
          res.data.code === 200 &&
          !res.data.payload.india_classification.length
        ) {
          setMapData({
            error: true,
            message: "India map not found in the uploaded image!",
          });
        }

        if (
          res.data.code === 200 &&
          res.data.payload.india_classification.length &&
          !res.data.payload.india_classification[0].present
        ) {
          setMapData({
            error: true,
            message: "India map not found in the uploaded image!",
          });
        }
      });
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Typography component="div">
        <Box fontWeight="fontWeightBold" mt={5} ml={5} className="heading-1">
          India Map Detector
        </Box>
      </Typography>
      <Grid container spacing={0}>
        {/* Right side */}
        <Grid item xs={12} md={6} lg={6}>
          <MapDetectorUploadView
            uploadFile={getMapFileData}
            sendImgValue={getMapImageValue}
          />
        </Grid>
        {/* Left side */}
        <Grid item xs={12} md={6} lg={6}>
          {mapData && (
            <MapDetectorResultView data={mapData} imgValue={imgMapValue} />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
